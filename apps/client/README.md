# Client

The client is a React application built with Vite and TypeScript. It provides the user interface for the real-time chat application and communicates with the Socket.IO server using a persistent WebSocket connection.

---

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Socket.IO Client

---

## Responsibilities

* Establish a Socket.IO connection with the server
* Emit client-side socket events
* Listen for server-side socket events
* Manage chat and user state
* Render the chat interface
* Display online users in real time
* Display real-time typing indicators
* Automatically scroll to the latest message

---

# Current Features

## Join Chat

* Join Chat screen
* Username input and validation
* Local username state
* `join_chat` socket event
* Transition from Join Chat screen to Chat interface

---

## Socket.IO

* Manual Socket.IO connection
* Connection lifecycle handling

  * Connect
  * Disconnect
* Client-to-server event communication
* Server-to-client event listeners
* Real-time message communication
* Real-time online user synchronization
* Real-time typing indicator

---

## Online Users

* Display currently connected users
* Receive `online_users` updates from the server
* Automatically update the sidebar when users join
* Automatically update the sidebar when users disconnect

---

## Chat Messaging

* Send messages in real time
* Receive messages in real time
* Broadcast messages between connected clients
* Display own messages differently from other users
* Server-generated message IDs
* Server-generated timestamps
* Message timestamps displayed in the chat
* Stable React keys using message IDs
* Automatic scroll to the latest message

---

## Typing Indicator

* Detect when the current user starts typing
* Emit `typing` socket event
* Receive typing status from other users
* Display:

```text
Alice is typing...
```

* Debounced typing detection
* Emit `stop_typing` after the user stops typing
* Remove typing indicator when the user stops typing

### Typing Event Flow

```text
User Types
    │
    ▼
Client
    │
    │ typing
    ▼
Socket.IO Server
    │
    │ user_typing
    ▼
Other Clients
    │
    ▼
"Alice is typing..."
```

When the user stops typing:

```text
User Stops Typing
        │
        ▼
Client Timer Expires
        │
        │ stop_typing
        ▼
Socket.IO Server
        │
        │ user_stopped_typing
        ▼
Other Clients
        │
        ▼
Remove Typing Indicator
```

---

# Message Structure

Messages received from the server follow the structure:

```ts
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}
```

Example:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "Subramanya",
  "message": "Hello Socket.IO 👋",
  "timestamp": "2026-08-13T15:30:00.000Z"
}
```

The server is responsible for generating:

* `id`
* `timestamp`

The client is responsible for displaying the message.

---

# Message Rendering

The client determines whether a message belongs to the current user:

```ts
const isOwnMessage = message.username === username;
```

Own messages are displayed on the right:

```text
                         You
              ┌──────────────────────┐
              │ Hello 👋              │
              │ 08:30 PM              │
              └──────────────────────┘
```

Messages from other users are displayed on the left:

```text
Alice
┌──────────────────────┐
│ Hello!               │
│ 08:31 PM             │
└──────────────────────┘
```

---

# Application Flow

```text
                    React Application
                           │
                           ▼
                     Join Chat
                           │
                           ▼
                  Enter Username
                           │
                           ▼
                     join_chat
                           │
                           ▼
                   Socket.IO Server
                           │
                           ▼
                    Chat Interface
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    Send Message     Online Users     Typing Indicator
          │                │                │
          ▼                ▼                ▼
      Server          Server           Server
          │                │                │
          ▼                ▼                ▼
    Receive Message  Updated Users   Typing Status
```

---

# Component Architecture

```text
App
│
├── JoinChat
│
└── ChatLayout
    │
    ├── Sidebar
    │   └── Online Users
    │
    ├── MessageList
    │   └── ChatMessageItem
    │
    └── ChatBox
        └── Typing Indicator
```

---

# Folder Structure

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
│   └── message.ts
│
├── App.tsx
└── main.tsx
```

---

# Getting Started

## Install Dependencies

```bash
pnpm install
```

## Start Development Server

```bash
pnpm dev
```

The client runs on:

```text
http://localhost:5173
```

The Socket.IO server runs on:

```text
http://localhost:3000
```

---

# Current Learning Milestone

* React component architecture
* TypeScript interfaces and props
* React state management using Hooks
* Socket.IO client initialization
* Event-driven communication
* WebSocket connection lifecycle
* Real-time messaging
* Online user presence
* Disconnect handling
* Message ownership
* Server-generated message metadata
* Stable message identity
* Auto-scrolling
* Debounced typing detection
* Real-time typing indicators
* Tailwind CSS chat UI

---

# Current Socket Events

| Event                 | Direction       | Purpose                                      |
| --------------------- | --------------- | -------------------------------------------- |
| `connect`             | Server → Client | Indicates successful socket connection       |
| `join_chat`           | Client → Server | Registers the user                           |
| `online_users`        | Server → Client | Updates online users                         |
| `send_message`        | Client → Server | Sends a chat message                         |
| `receive_message`     | Server → Client | Receives a broadcast message                 |
| `typing`              | Client → Server | Indicates that the user is typing            |
| `user_typing`         | Server → Client | Notifies other clients that a user is typing |
| `stop_typing`         | Client → Server | Indicates that the user stopped typing       |
| `user_stopped_typing` | Server → Client | Removes another user's typing indicator      |
| `disconnect`          | Server → Client | Indicates socket disconnection               |

---

# Current Status

✅ React + Vite setup

✅ TypeScript setup

✅ Tailwind CSS

✅ Socket.IO client connection

✅ Join Chat

✅ Online Users

✅ Disconnect Cleanup

✅ Real-time Messaging

✅ Message Broadcasting

✅ Own vs Other Message UI

✅ Server-generated Message IDs

✅ Server-generated Timestamps

✅ Auto-scroll

✅ Real-time Typing Indicator

✅ Debounced Stop-Typing Handling

🚧 Join/Leave Notifications

🚧 Message Persistence

🚧 Chat Rooms

🚧 Private Messaging

🚧 Authentication

🚧 MongoDB Integration

🚧 Redis Integration

🚧 Horizontal Scaling

---

# Upcoming Features

* Join and leave notifications
* Message persistence
* Chat rooms
* Private messaging
* JWT authentication
* MongoDB integration
* Redis Pub/Sub
* Socket.IO Redis Adapter
* Horizontal scaling
* Message history
* File sharing
* Read receipts
* Message reactions
* User avatars
* Dark mode
