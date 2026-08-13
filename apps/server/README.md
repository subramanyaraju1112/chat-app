# Server

The server is a Node.js application built with Express, TypeScript, and Socket.IO.

It acts as the central authority for the chat application by managing the HTTP server, maintaining WebSocket connections, tracking connected users, generating message metadata, and broadcasting real-time events between clients.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- Socket.IO

---

## Responsibilities

- Start the HTTP server
- Initialize the Socket.IO server
- Accept incoming client connections
- Handle real-time socket events
- Track connected users
- Remove disconnected users
- Broadcast online user updates
- Receive and broadcast chat messages
- Generate unique message IDs
- Generate server-side message timestamps
- Broadcast typing status
- Serve REST APIs in the future

---

# Architecture

```text
                     React Client
                           │
                           │
                    Socket.IO Client
                           │
══════════════════════════════════════════════
              Persistent WebSocket
══════════════════════════════════════════════
                           │
                           ▼
                 Node HTTP Server
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
            Express              Socket.IO
            Routes                Events
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
              User Presence       Messages       Typing State
                     │                │                │
                     ▼                ▼                ▼
                Map Store       Message Data      Ephemeral Events
```

---

# Current Features

## HTTP Server

- Express application setup
- Node HTTP server
- Socket.IO attached to the HTTP server
- CORS configuration for the React client

---

## Socket.IO

- Client connection handling
- Client disconnection handling
- Join chat event
- Online users broadcast
- Send message event
- Receive message broadcast
- Typing event
- Stop typing event

---

# Connected Users

The server maintains an in-memory `Map` to track currently connected users:

```ts
const connectedUsers = new Map<string, string>();
```

The Map stores:

```text
socket.id → username
```

Example:

```text
Map

A12BC34 → Alice
F56GH78 → Bob
X91YZ45 → Subramanya
```

When a user joins:

```ts
connectedUsers.set(socket.id, username);
```

When a user disconnects:

```ts
connectedUsers.delete(socket.id);
```

After either operation, the server broadcasts the updated user list:

```ts
io.emit("online_users", [...connectedUsers.values()]);
```

---

# Message Handling

When a client sends:

```text
send_message
```

the server creates the complete message object.

```ts
const message = {
  id: randomUUID(),
  username: data.username,
  message: data.message,
  timestamp: new Date().toISOString(),
};
```

The server is therefore responsible for generating:

- Unique message ID
- Message timestamp

The completed message is then broadcast:

```ts
io.emit("receive_message", message);
```

---

# Message Structure

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

Using server-generated IDs and timestamps ensures that all clients receive the same message metadata.

---

# Typing Indicator

The server treats typing status as **ephemeral real-time state**.

Typing information is not persisted as a chat message.

## User Starts Typing

The client emits:

```text
typing
```

The server receives it and broadcasts to all other clients:

```ts
socket.broadcast.emit("user_typing", {
  username: data.username,
});
```

The sender does not receive their own typing event.

---

## User Stops Typing

The client emits:

```text
stop_typing
```

The server broadcasts:

```ts
socket.broadcast.emit("user_stopped_typing", {
  username: data.username,
});
```

This allows other clients to remove the typing indicator.

---

# Typing Event Flow

```text
Client A
   │
   │ typing
   ▼
Server
   │
   │ socket.broadcast.emit()
   ▼
Client B / Client C
   │
   ▼
"Alice is typing..."
```

When typing stops:

```text
Client A
   │
   │ stop_typing
   ▼
Server
   │
   │ socket.broadcast.emit()
   ▼
Client B / Client C
   │
   ▼
Remove typing indicator
```

---

# Why `socket.broadcast.emit()`?

For typing events, the sender doesn't need to receive their own typing status.

Therefore:

```ts
socket.broadcast.emit(...)
```

is used instead of:

```ts
io.emit(...)
```

The difference is:

```text
io.emit()
    ↓
Every connected client
    including sender


socket.broadcast.emit()
    ↓
Every connected client
    except sender
```

For chat messages, we use:

```ts
io.emit("receive_message", message);
```

because the sender also needs to receive the broadcasted message.

---

# Socket Events

| Event                 | Direction       | Description                                         |
| --------------------- | --------------- | --------------------------------------------------- |
| `connection`          | Client → Server | Fired when a client establishes a socket connection |
| `join_chat`           | Client → Server | Registers the user's username                       |
| `online_users`        | Server → Client | Broadcasts the current online users                 |
| `send_message`        | Client → Server | Receives a message from a client                    |
| `receive_message`     | Server → Client | Broadcasts a message to connected clients           |
| `typing`              | Client → Server | Indicates that a user is typing                     |
| `user_typing`         | Server → Client | Notifies other clients that a user is typing        |
| `stop_typing`         | Client → Server | Indicates that a user stopped typing                |
| `user_stopped_typing` | Server → Client | Notifies other clients that typing stopped          |
| `disconnect`          | Client → Server | Handles socket disconnection                        |

---

# Event Flow

## User Joins Chat

```text
Client
   │
   ▼
join_chat
   │
   ▼
Server
   │
   ▼
connectedUsers.set()
   │
   ▼
Broadcast online_users
   │
   ▼
Every Connected Client
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
   ▼
connectedUsers.delete(socket.id)
   │
   ▼
Broadcast online_users
   │
   ▼
Every Connected Client
```

---

## User Sends Message

```text
Client
   │
   ▼
send_message
   │
   ▼
Server
   │
   ├── Generate message ID
   │
   ├── Generate timestamp
   │
   ▼
receive_message
   │
   ▼
Broadcast to Clients
```

---

## User Typing

```text
Client
   │
   ▼
typing
   │
   ▼
Server
   │
   ▼
user_typing
   │
   ▼
Other Clients
```

---

# Server Lifecycle

```text
Server Starts
      │
      ▼
Initialize Express
      │
      ▼
Create HTTP Server
      │
      ▼
Initialize Socket.IO
      │
      ▼
Wait for Client Connections
      │
      ▼
Client Connects
      │
      ▼
Socket Connection Established
      │
      ▼
Listen for Socket Events
      │
      ├── join_chat
      ├── send_message
      ├── typing
      ├── stop_typing
      └── disconnect
```

---

# Folder Structure

```text
src/
├── app.ts
├── server.ts
│
├── sockets/
│   └── index.ts
│
├── controllers/
├── routes/
├── services/
├── middleware/
├── utils/
├── config/
└── types/
```

---

# Current Project Architecture

```text
Socket.IO Server

│
├── HTTP Server
│
├── Express App
│
├── Connected Users
│      │
│      ├── socket.id → username
│      └── Active Users
│
├── Message Processing
│      │
│      ├── Generate ID
│      ├── Generate Timestamp
│      └── Broadcast Message
│
└── Socket Events
       │
       ├── connection
       ├── join_chat
       ├── online_users
       ├── send_message
       ├── receive_message
       ├── typing
       ├── user_typing
       ├── stop_typing
       ├── user_stopped_typing
       └── disconnect
```

---

# Getting Started

## Install Dependencies

```bash
pnpm install
```

---

## Start Development Server

```bash
pnpm dev
```

The server runs on:

```text
http://localhost:3000
```

The React client is expected to run on:

```text
http://localhost:5173
```

---

# Available Scripts

```bash
pnpm dev
```

Starts the development server with hot reload.

```bash
pnpm build
```

Compiles the TypeScript project.

```bash
pnpm start
```

Runs the compiled production build.

---

# Current Learning Milestone

- Express application architecture
- Node.js HTTP server
- Socket.IO initialization
- WebSocket connection lifecycle
- Event-driven architecture
- Socket event handling
- Real-time message broadcasting
- Online user presence
- Disconnect cleanup
- In-memory state management using `Map`
- Server-generated message IDs
- Server-generated timestamps
- Real-time typing events
- `socket.broadcast.emit()` usage
- Separation of persistent and ephemeral events

---

# Design Principles

- Event-driven architecture
- Separation of HTTP and WebSocket responsibilities
- Type-safe event payloads using TypeScript
- In-memory state management for active connections
- Server-authoritative message metadata
- Separation of persistent messages and ephemeral events
- Clean separation of concerns
- Scalable foundation for distributed communication

---

# Current Status

✅ Express Server

✅ HTTP Server

✅ Socket.IO Server

✅ Client Connections

✅ Join Chat Event

✅ Online Users Synchronization

✅ Disconnect Cleanup

✅ Send Message Event

✅ Receive Message Broadcast

✅ Server-generated Message IDs

✅ Server-generated Message Timestamps

✅ Typing Event

✅ Stop Typing Event

✅ Real-time Typing Indicator

🚧 Join/Leave Notifications

🚧 Message Persistence

🚧 Chat Rooms

🚧 Private Messaging

🚧 Authentication

🚧 MongoDB Integration

🚧 Redis Pub/Sub

🚧 Socket.IO Redis Adapter

🚧 Horizontal Scaling

---

# Upcoming Features

- Join and leave notifications
- MongoDB message persistence
- Chat rooms using Socket.IO rooms
- Private messaging
- JWT authentication
- Message history
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- File sharing
- Read receipts
- Message reactions
- User avatars
- Rate limiting
- Production monitoring
