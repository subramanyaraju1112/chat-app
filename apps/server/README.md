# Server

The server is a Node.js application built with Express, TypeScript, Socket.IO, and MongoDB.

It acts as the central authority for the chat application by managing the HTTP server, maintaining WebSocket connections, tracking connected users, generating message metadata, handling real-time events, and providing database connectivity.

---

# Tech Stack

- Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB
- Mongoose
- dotenv

---

# Responsibilities

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
- Generate join/leave system messages
- Establish MongoDB connection
- Persist chat data in MongoDB (Upcoming)
- Serve REST APIs (Future)

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
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
             Express                   Socket.IO
             Routes                     Events
                                          │
                   ┌──────────────────────┼──────────────────────┐
                   │                      │                      │
                   ▼                      ▼                      ▼
             User Presence            Messages             Typing State
                   │                      │                      │
                   ▼                      ▼                      ▼
              Map Store              Message Data          Ephemeral Events
                                          │
                                          ▼
                                      Mongoose
                                          │
                                          ▼
                                      MongoDB
```

---

# Current Features

## HTTP Server

- Express application setup
- Node HTTP server
- Socket.IO attached to the HTTP server
- CORS configuration for the React client
- Environment variable configuration using dotenv

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
- Join system message
- Leave system message

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

After users join or disconnect, the server broadcasts the updated user list:

```ts
io.emit("online_users", [...connectedUsers.values()]);
```

The Map currently represents active users connected to the current server instance.

---

# MongoDB

MongoDB is used as the database layer for the chat application.

The server uses **Mongoose** to establish and manage the MongoDB connection.

## Database Connection

The connection is initialized when the server starts.

```text
Server Starts
      │
      ▼
Load Environment Variables
      │
      ▼
Connect to MongoDB
      │
      ├── Success
      │      │
      │      ▼
      │   Start HTTP Server
      │
      └── Failure
             │
             ▼
        Server Startup Fails
```

The MongoDB connection is configured through the environment variable:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/socket-chat
```

The application does not hard-code database credentials or connection strings.

---

# Database Configuration

MongoDB connection logic is separated from the application startup code.

```text
src/
├── config/
│   └── database.ts
```

The database configuration is responsible for:

- Reading `MONGODB_URI`
- Establishing the Mongoose connection
- Logging successful connections
- Handling connection failures

---

# Message Handling

When a client sends:

```text
send_message
```

the server creates the complete message object.

A normal message contains:

```ts
const message = {
  id: randomUUID(),
  type: "message",
  username: data.username,
  message: data.message,
  timestamp: new Date().toISOString(),
};
```

The server is responsible for generating:

- Unique message ID
- Message timestamp
- Message type

The completed message is then broadcast:

```ts
io.emit("receive_message", message);
```

---

# Message Types

The application currently supports two message types:

```text
message
system
```

## Normal Message

A normal user-generated message contains:

```ts
{
  type: "message",
  id: "...",
  username: "Subramanya",
  message: "Hello Socket.IO 👋",
  timestamp: "..."
}
```

## System Message

A system-generated event contains:

```ts
{
  type: "system",
  id: "...",
  message: "Alice joined the chat",
  timestamp: "..."
}
```

System messages are generated by the server for application events such as:

- User joining the chat
- User leaving the chat

---

# Message Structure

The client-side message model uses a discriminated union:

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

This allows the application to distinguish between:

```text
type === "message"
        │
        ▼
Normal Chat Message
```

and:

```text
type === "system"
        │
        ▼
System Notification
```

---

# Join Chat

When a user joins the chat:

```text
Client
   │
   ▼
join_chat
   │
   ▼
Server
   │
   ├── Store socket.id → username
   │
   ├── Broadcast online_users
   │
   └── Create system message
            │
            ▼
       receive_message
            │
            ▼
      All Connected Clients
```

The server creates a system message:

```ts
{
  id: randomUUID(),
  type: "system",
  message: `${username} joined the chat`,
  timestamp: new Date().toISOString()
}
```

Example:

```text
────────────────────────────────
      Alice joined the chat
────────────────────────────────
```

---

# Disconnect Handling

When a client disconnects:

```text
Client
   │
   ▼
disconnect
   │
   ▼
Server
   │
   ├── Get username from socket.id
   │
   ├── Remove user from Map
   │
   ├── Create leave system message
   │
   └── Broadcast updated online_users
```

The username must be retrieved before deleting the socket from the Map:

```ts
const username = connectedUsers.get(socket.id);

connectedUsers.delete(socket.id);
```

If the username exists, the server creates:

```ts
{
  id: randomUUID(),
  type: "system",
  message: `${username} left the chat`,
  timestamp: new Date().toISOString()
}
```

This is then broadcast to the remaining clients.

---

# Typing Indicator

The server treats typing status as **ephemeral real-time state**.

Typing information is not treated as a persistent chat message.

---

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

For chat messages and system messages, we use:

```ts
io.emit(...)
```

because every connected client should receive them.

---

# Socket Events

| Event                 | Direction       | Description                                         |
| --------------------- | --------------- | --------------------------------------------------- |
| `connection`          | Client → Server | Fired when a client establishes a socket connection |
| `join_chat`           | Client → Server | Registers the user's username                       |
| `online_users`        | Server → Client | Broadcasts the current online users                 |
| `send_message`        | Client → Server | Receives a message from a client                    |
| `receive_message`     | Server → Client | Broadcasts a message or system message              |
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
   ├── connectedUsers.set()
   │
   ├── Broadcast online_users
   │
   └── Create system message
            │
            ▼
       receive_message
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
   ├── Get username
   │
   ├── connectedUsers.delete()
   │
   ├── Create system message
   │
   └── Broadcast online_users
            │
            ▼
     Remaining Clients
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
   ├── Set type = "message"
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

# Server Startup Flow

```text
Server Starts
      │
      ▼
Load Environment Variables
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
Connect to MongoDB
      │
      ├── Success
      │      │
      │      ▼
      │   Start HTTP Server
      │
      └── Failure
             │
             ▼
        Exit Application
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
├── config/
│   └── database.ts
│
├── controllers/
├── routes/
├── services/
├── middleware/
├── utils/
├── models/
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
├── MongoDB
│      │
│      └── Mongoose
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
│      ├── Determine Message Type
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

## Environment Variables

Create a `.env` file in the server root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/socket-chat
```

For production, use the appropriate MongoDB connection string.

Do not commit `.env` to Git.

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
- Normal and system message types
- Join/leave system messages
- Real-time typing events
- `socket.broadcast.emit()` usage
- Separation of persistent and ephemeral events
- MongoDB connection
- Mongoose integration
- Environment-based database configuration
- Database-first server startup

---

# Design Principles

- Event-driven architecture
- Separation of HTTP and WebSocket responsibilities
- Type-safe event payloads using TypeScript
- In-memory state management for active connections
- Server-authoritative message metadata
- Separation of persistent messages and ephemeral events
- Separation of socket communication and database logic
- Environment-based configuration
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

✅ Normal Message Type

✅ System Message Type

✅ Join System Messages

✅ Leave System Messages

✅ Typing Event

✅ Stop Typing Event

✅ Real-time Typing Indicator

✅ MongoDB Connection

✅ Mongoose Setup

🚧 Message Persistence

🚧 Message History

🚧 Chat Rooms

🚧 Private Messaging

🚧 Authentication

🚧 Redis Pub/Sub

🚧 Socket.IO Redis Adapter

🚧 Horizontal Scaling

---

# Upcoming Features

- MongoDB message persistence
- Message history
- Chat rooms using Socket.IO rooms
- Private messaging
- JWT authentication
- User authentication and authorization
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- File sharing
- Read receipts
- Message reactions
- User avatars
- Rate limiting
- Production monitoring
