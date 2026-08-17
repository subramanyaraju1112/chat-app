# Client

The client is a React application built with Vite and TypeScript. It provides the user interface for the real-time chat application and communicates with the Socket.IO server using a persistent WebSocket connection.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

---

## Responsibilities

- Establish a Socket.IO connection with the server
- Emit client-side socket events
- Listen for server-side socket events
- Manage chat and user state
- Render the chat interface
- Display online users in real time
- Display real-time typing indicators
- Display system notifications
- Load previous chat messages
- Automatically scroll to the latest message

---

# Current Features

## Join Chat

- Join Chat screen
- Username input and validation
- Local username state
- `join_chat` socket event
- Transition from Join Chat screen to Chat interface
- Server-generated join notification

---

## Socket.IO

- Manual Socket.IO connection
- Connection lifecycle handling
  - Connect
  - Disconnect
- Client-to-server event communication
- Server-to-client event listeners
- Real-time message communication
- Real-time online user synchronization
- Real-time typing indicator
- Message history synchronization
- Join and leave notifications

---

## Online Users

- Display currently connected users
- Receive `online_users` updates from the server
- Automatically update the sidebar when users join
- Automatically update the sidebar when users disconnect
- Real-time synchronization of active users

---

## Chat Messaging

- Send messages in real time
- Receive messages in real time
- Broadcast messages between connected clients
- Display own messages differently from other users
- Server-generated message IDs
- Server-generated timestamps
- Message timestamps displayed in the chat
- Stable React keys using message IDs
- Automatic scroll to the latest message
- Message persistence through MongoDB
- Load previous messages when joining the chat
- Display the latest 50 messages from the server

---

## Message History

When a user joins the chat, the client requests the existing message history through the Socket.IO connection.

The server retrieves the latest messages from MongoDB and sends them only to the newly connected client.

```text
User Joins
    │
    ▼
join_chat
    │
    ▼
Socket.IO Server
    │
    ▼
MongoDB
    │
    ▼
Message History
    │
    ▼
message_history
    │
    ▼
New Client
    │
    ▼
Display Previous Messages
```

The client listens for:

```text
message_history
```

and updates the local message state.

---

## Message Persistence

New messages are persisted by the server before being broadcast to connected clients.

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
Saved Message
   │
   ▼
receive_message
   │
   ▼
Connected Clients
```

This means refreshing the browser does not permanently remove previously stored messages.

---

## System Messages

The client supports server-generated system messages.

System messages are used for events such as:

- User joining the chat
- User leaving the chat

Example:

```text
────────────────────────────────
      Alice joined the chat
────────────────────────────────
```

System messages are rendered differently from normal user messages.

---

# Message Structure

The client uses a discriminated union to represent different message types:

```ts
export type ChatMessage =
  | {
      type: "message";
      id: string;
      username: string;
      message: string;
      timestamp: string;
    }
  | {
      type: "system";
      id: string;
      message: string;
      timestamp: string;
    };
```

---

## Normal Message

Example:

```json
{
  "type": "message",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "Subramanya",
  "message": "Hello Socket.IO 👋",
  "timestamp": "2026-08-13T15:30:00.000Z"
}
```

---

## System Message

Example:

```json
{
  "type": "system",
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "message": "Alice joined the chat",
  "timestamp": "2026-08-13T15:31:00.000Z"
}
```

The server is responsible for generating:

- `id`
- `timestamp`
- `type`

The client is responsible for rendering the message appropriately.

---

# Message Rendering

The client determines whether a normal message belongs to the current user:

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

System messages are displayed separately:

```text
────────────────────────────────
      Alice joined the chat
────────────────────────────────
```

---

# Typing Indicator

The client supports real-time typing indicators.

Features include:

- Detect when the current user starts typing
- Emit `typing` socket event
- Receive typing status from other users
- Display:

```text
Alice is typing...
```

- Debounced typing detection
- Emit `stop_typing` after the user stops typing
- Remove typing indicator when the user stops typing
- Stop typing immediately when a message is sent
- Clean up the typing timer when the component unmounts

### Typing Event Flow

```text
User Types
    │
    ▼
ChatBox
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
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
       Message History  Online Users  System Message
             │             │             │
             ▼             ▼             ▼
       Chat Interface
             │
     ┌───────┼────────┐
     │       │        │
     ▼       ▼        ▼
  Messages Typing  Online Users
     │       │        │
     ▼       ▼        ▼
   Server   Server   Server
```

---

# Message Flow

## Sending a Message

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
Saved Message
   │
   ▼
receive_message
   │
   ├──────────► Client A
   ├──────────► Client B
   └──────────► Client C
```

---

## Loading Message History

```text
Client
   │
   │ join_chat
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
Latest 50 Messages
   │
   ▼
message_history
   │
   ▼
Joining Client
```

---

## User Joins

```text
Client
   │
   │ join_chat
   ▼
Server
   │
   ├── Register User
   │
   ├── Update Online Users
   │
   └── Create Join System Message
              │
              ▼
       receive_message
              │
              ▼
       Connected Clients
```

---

## User Disconnects

```text
Client
   │
   ▼
disconnect
   │
   ▼
Server
   │
   ├── Remove User
   │
   ├── Update Online Users
   │
   └── Create Leave System Message
              │
              ▼
       receive_message
              │
              ▼
       Remaining Clients
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
        ├── Message Input
        ├── Send Button
        └── Typing Lifecycle
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

- React component architecture
- TypeScript interfaces and props
- React state management using Hooks
- Socket.IO client initialization
- Event-driven communication
- WebSocket connection lifecycle
- Real-time messaging
- Message broadcasting
- Online user presence
- Disconnect handling
- Join and leave notifications
- System messages
- Message ownership
- Server-generated message metadata
- Stable message identity
- Auto-scrolling
- Message history
- MongoDB-backed message persistence
- Debounced typing detection
- Real-time typing indicators
- Tailwind CSS chat UI
- Separation of real-time and persistent data flows

---

# Current Socket Events

| Event                 | Direction       | Purpose                                            |
| --------------------- | --------------- | -------------------------------------------------- |
| `connect`             | Server → Client | Indicates successful socket connection             |
| `join_chat`           | Client → Server | Registers the user                                 |
| `online_users`        | Server → Client | Updates online users                               |
| `send_message`        | Client → Server | Sends a chat message                               |
| `receive_message`     | Server → Client | Receives a broadcast message or system message     |
| `message_history`     | Server → Client | Sends previous chat messages to the joining client |
| `typing`              | Client → Server | Indicates that the user is typing                  |
| `user_typing`         | Server → Client | Notifies other clients that a user is typing       |
| `stop_typing`         | Client → Server | Indicates that the user stopped typing             |
| `user_stopped_typing` | Server → Client | Removes another user's typing indicator            |
| `disconnect`          | Server → Client | Indicates socket disconnection                     |

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

✅ Join Notifications

✅ Leave Notifications

✅ System Message Rendering

✅ Real-time Typing Indicator

✅ Debounced Stop-Typing Handling

✅ MongoDB Message Persistence

✅ Message History

🚧 Chat Rooms

🚧 Private Messaging

🚧 Authentication

🚧 Redis Integration

🚧 Horizontal Scaling

🚧 File Sharing

🚧 Read Receipts

---

# Upcoming Features

- Chat rooms
- Socket.IO rooms
- Private messaging
- JWT authentication
- User authentication and authorization
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- Message pagination
- File sharing
- Read receipts
- Message reactions
- User avatars
- Dark mode
- Rate limiting
- Production monitoring

---

# Project Architecture

```text
                         React Client
                              │
                              │
                       Socket.IO Client
                              │
══════════════════════════════════════════════
             Persistent WebSocket Connection
══════════════════════════════════════════════
                              │
                              ▼
                    Socket.IO Server
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
          User Presence    Messages      Typing
                │             │             │
                │             ▼             │
                │       Message Service     │
                │             │             │
                │             ▼             │
                │         MongoDB            │
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                       Connected Clients
```

---

# Current Architecture Status

```text
React Client
     │
     ▼
Socket.IO Client
     │
     ▼
Node.js + Socket.IO
     │
     ├── Online Users
     │
     ├── Real-time Messaging
     │
     ├── Typing Indicators
     │
     ├── System Messages
     │
     └── Message Service
             │
             ▼
          MongoDB
```

---

# Future Architecture

```text
                         React Clients
                              │
                              ▼
                     Load Balancer
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
          Node.js #1       Node.js #2       Node.js #3
              │               │               │
              └───────────────┼───────────────┘
                              │
                         Redis Adapter
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
              Redis                    MongoDB
           Pub/Sub / State          Message Storage
```

The future architecture will allow the application to scale horizontally across multiple Node.js instances while maintaining real-time communication between connected clients.
