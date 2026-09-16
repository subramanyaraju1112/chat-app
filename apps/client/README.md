# Client

Frontend for the real-time chat application built with React, TypeScript, Vite, Tailwind CSS, and Socket.IO Client.

The client provides authentication, chat UI, room management, real-time messaging, online user presence, typing indicators, and message history.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

## Features

### Authentication
- User login
- JWT access token handling
- Authenticated Socket.IO connection
- Server-provided authenticated socket identity

### Real-Time Chat
- Socket.IO connections
- Real-time messaging
- Online user presence
- Typing indicators
- Join/leave system messages
- Automatic scroll to latest message

### Chat Rooms
- Multiple chat rooms
- Room switching
- Room-specific messaging
- Room-specific message history
- Room-specific typing indicators
- Server-controlled room membership

### Message Persistence
- MongoDB-backed message history
- Latest 50 messages per room
- Normal and system message rendering

## Architecture

```text
                    React Application
                           │
                           ▼
                    Authentication
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                HTTP API      Socket.IO Client
                    │             │
                    │             │ JWT
                    │             ▼
                    │       Socket.IO Server
                    │             │
                    └─────────────┤
                                  ▼
                             MongoDB
```

The client communicates with the backend through HTTP APIs for authentication and Socket.IO for real-time communication.

## Application Structure

```text
App
│
├── Authentication
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

## Authentication

The client authenticates through the backend login API.

```text
Client
  │
  │ POST /api/auth/login
  ▼
Server
  │
  │ accessToken + user
  ▼
Client
  │
  │ socket.auth = { token }
  ▼
Socket.IO Handshake
  │
  ▼
Authenticated Socket
```

The Socket.IO client uses:

```ts
socket.auth = {
  token: accessToken,
};

socket.connect();
```

The server verifies the token during the Socket.IO handshake.

The client uses `autoConnect: false` so the socket can be authenticated before establishing the connection.

## Chat Rooms

The client supports multiple rooms:

```text
general
technology
gaming
```

The current room is maintained in application state.

When switching rooms, the client:

1. Updates the selected room.
2. Clears the current messages.
3. Clears the typing indicator.
4. Emits `join_room`.
5. Receives the new room's message history.

The server controls the actual Socket.IO room membership.

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
Message Service
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

Normal messages are styled according to ownership, while system messages are displayed separately.

## Message History

When joining a room, the client receives previous messages through:

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

## Online Users

The client listens for:

```text
online_users
```

and updates the sidebar whenever users join or disconnect.

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

## System Messages

The client supports server-generated system messages for events such as:

```text
Alice joined the chat
Alice left the chat
```

System messages are persisted and displayed differently from normal messages.

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
| `disconnect` | Server | Handle disconnect |

## Folder Structure

```text
src/
├── components/
│   ├── auth/
│   │   └── JoinChat.tsx
│   ├── chat/
│   │   ├── ChatBox.tsx
│   │   ├── ChatLayout.tsx
│   │   ├── ChatMessageItem.tsx
│   │   └── MessageList.tsx
│   └── sidebar/
│       └── Sidebar.tsx
│
├── socket/
│   └── socket.ts
│
├── types/
│   ├── auth.ts
│   ├── message.ts
│   └── room.ts
│
├── App.tsx
└── main.tsx
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Client: `http://localhost:5173`

Backend: `http://localhost:3000`

## Current Status

### Application
- ✅ React + Vite
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Socket.IO Client
- ✅ Chat UI
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

### Authentication
- 🚧 Login UI
- 🚧 JWT access token handling
- 🚧 Connect JWT with Socket.IO handshake
- 🚧 Authenticated socket identity
- 🚧 Protected client routes
- 🚧 Refresh token handling

### Upcoming
- 🚧 Private messaging
- 🚧 Message pagination
- 🚧 File sharing
- 🚧 Read receipts
- 🚧 Message reactions
- 🚧 Dark mode

## Roadmap

### Authentication
- Complete client login flow
- Pass JWT through Socket.IO handshake
- Use authenticated socket identity
- Remove client-provided username from trusted events
- Add protected client routes
- Add refresh token handling

### Messaging
- Private messaging
- Message pagination
- Message delivery/read status
- Message editing and deletion
- Message reactions
- File sharing

### UI
- Dark mode
- Improved responsive layouts
- Notifications
- User profiles

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
                Pub/Sub            Persistence
```

The application is designed to evolve from a single Socket.IO server into a horizontally scalable real-time system.
