# Client

Frontend for the real-time chat application built with React, TypeScript, Vite, Tailwind CSS, and Socket.IO Client.

The client provides the chat UI, room management, real-time messaging, online user presence, typing indicators, and message history.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

---

## Features

- Join chat with username
- Real-time messaging
- Chat rooms
- Room switching
- Room-specific message history
- Online users
- Typing indicators
- Join/leave system messages
- Own vs other message styling
- Automatic scroll to latest message
- MongoDB-backed message history
- Socket.IO real-time communication

---

## Architecture

```text
                    React Application
                           │
                           ▼
                     Socket.IO Client
                           │
                           ▼
                    Node.js + Socket.IO
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Rooms        Messages      Typing
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                        MongoDB
```

---

## Application Structure

```text
App
│
├── JoinChat
│
└── ChatLayout
    │
    ├── Sidebar
    │   ├── Rooms
    │   └── Online Users
    │
    ├── MessageList
    │   └── ChatMessageItem
    │
    └── ChatBox
        └── Message Input
```

---

## Chat Rooms

The client supports multiple rooms:

```text
general
technology
gaming
```

The current room is maintained in application state.

When switching rooms, the client:

1. Updates the selected room
2. Clears the current messages
3. Clears the typing indicator
4. Emits `join_room`
5. Receives the new room's message history

The server controls the actual Socket.IO room membership.

---

## Messaging

Messages are sent through Socket.IO and persisted by the server.

```text
Client
  │
  │ send_message
  ▼
Socket.IO Server
  │
  ▼
MongoDB
  │
  ▼
receive_message
  │
  ▼
Room Members
```

The client renders messages based on their type:

```ts
type ChatMessage =
  | {
      type: "message";
      id: string;
      username: string;
      message: string;
      room: string;
      timestamp: string;
    }
  | {
      type: "system";
      id: string;
      message: string;
      room: string;
      timestamp: string;
    };
```

Normal messages are aligned according to ownership, while system messages are displayed separately.

---

## Message History

When joining a room, the client receives the room's previous messages through:

```text
message_history
```

The server currently returns the latest 50 messages for the selected room.

```text
join_room
    │
    ▼
Socket.IO Server
    │
    ▼
MongoDB
    │
    ▼
message_history
    │
    ▼
Client
```

---

## Online Users

The client listens for:

```text
online_users
```

and updates the sidebar whenever users join or disconnect.

---

## Typing Indicator

Typing is handled as real-time, non-persistent state.

```text
User Types
    │
    ▼
typing
    │
    ▼
Socket.IO Server
    │
    ▼
user_typing
    │
    ▼
Other Room Members
```

When typing stops:

```text
stop_typing
    │
    ▼
Socket.IO Server
    │
    ▼
user_stopped_typing
```

Typing notifications are scoped to the current room.

---

## System Messages

The client supports server-generated system messages for events such as:

```text
Alice joined the chat
Alice left the chat
```

System messages are persisted and displayed differently from normal messages.

---

## Socket Events

| Event | Direction | Purpose |
|---|---|---|
| `join_chat` | Client → Server | Register username |
| `online_users` | Server → Client | Update online users |
| `join_room` | Client → Server | Join a room |
| `message_history` | Server → Client | Load room history |
| `send_message` | Client → Server | Send message |
| `receive_message` | Server → Client | Receive message |
| `typing` | Client → Server | Start typing |
| `user_typing` | Server → Client | Typing notification |
| `stop_typing` | Client → Server | Stop typing |
| `user_stopped_typing` | Server → Client | Remove typing indicator |
| `disconnect` | Server → Client | Handle disconnect |

---

## Folder Structure

```text
src/
├── components/
│   ├── auth/
│   │   └── JoinChat.tsx
│   │
│   ├── chat/
│   │   ├── ChatBox.tsx
│   │   ├── ChatLayout.tsx
│   │   ├── ChatMessageItem.tsx
│   │   └── MessageList.tsx
│   │
│   └── sidebar/
│       └── Sidebar.tsx
│
├── socket/
│   └── socket.ts
│
├── types/
│   ├── message.ts
│   └── room.ts
│
├── App.tsx
└── main.tsx
```

---

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Client:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

## Current Status

### Completed

- ✅ React + Vite
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Socket.IO Client
- ✅ Join Chat
- ✅ Online Users
- ✅ Real-time Messaging
- ✅ Message History
- ✅ MongoDB Persistence
- ✅ Chat Rooms
- ✅ Room Switching
- ✅ Typing Indicators
- ✅ Join/Leave Notifications
- ✅ System Messages
- ✅ Auto-scroll

### Upcoming

- 🚧 Authentication UI
- 🚧 JWT integration
- 🚧 Private messaging
- 🚧 Message pagination
- 🚧 File sharing
- 🚧 Read receipts
- 🚧 Message reactions
- 🚧 Dark mode

---

## Future Architecture

```text
                         React Clients
                              │
                              ▼
                         Load Balancer
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
         Node.js #1       Node.js #2       Node.js #3
             │                │                │
             └────────────────┼────────────────┘
                              │
                     Socket.IO Redis Adapter
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                  Redis              MongoDB
```

The application is designed to evolve from a single Socket.IO server into a horizontally scalable real-time system.