# Server

The server is a Node.js application built with Express, TypeScript, and Socket.IO.

It acts as the central authority for the chat application by managing HTTP requests, maintaining WebSocket connections, tracking connected users, and broadcasting real-time events between clients.

---

# Tech Stack

- Node.js
- Express
- TypeScript
- Socket.IO

---

# Responsibilities

- Start the HTTP server
- Initialize the Socket.IO server
- Accept incoming client connections
- Handle real-time socket events
- Track connected users
- Broadcast messages to connected clients
- Synchronize online users across all clients
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
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
            Express              Socket.IO
            Routes                Events
                                      │
                                      ▼
                           Connected Users Map
```

---

# Current Features

## HTTP Server

- Express application setup
- Node HTTP server
- Socket.IO server initialization

## Socket.IO

- Client connection handling
- Client disconnection handling
- Join chat event
- Send message event
- Receive message broadcast
- Online users broadcast

## Connected Users

- In-memory user tracking using `Map`
- Associates each connected socket with a username
- Broadcasts the active users list to all connected clients

---

# Socket Events

| Event | Direction | Description |
|--------|-----------|-------------|
| `connection` | Client → Server | Fired when a client establishes a socket connection |
| `join_chat` | Client → Server | Registers the user's username with the server |
| `online_users` | Server → Client | Broadcasts the updated online users list |
| `send_message` | Client → Server | Receives a chat message from a client |
| `receive_message` | Server → Client | Broadcasts the chat message to all connected clients |
| `disconnect` | Client → Server | Fired when a client disconnects |

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
Store socket.id → username
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
   ▼
receive_message
   │
   ▼
Broadcast Message
   │
   ▼
Every Connected Client
```

---

# Connected Users

The server maintains an in-memory `Map` to track all currently connected users.

```ts
const connectedUsers = new Map<string, string>();
```

Where

```text
socket.id
      │
      ▼
username
```

Example

```text
Map

A12BC34
    │
    ▼
Alice

F56GH78
    │
    ▼
Bob

X91YZ45
    │
    ▼
Subramanya
```

Whenever a user joins

```ts
connectedUsers.set(socket.id, username);
```

Whenever a user disconnects (Upcoming)

```ts
connectedUsers.delete(socket.id);
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

# Current Project Structure

```text
Socket.IO Server

│
├── HTTP Server
│
├── Express App
│
├── Connected Users (Map)
│      │
│      ├── socket.id → username
│      └── Active Users
│
└── Socket Events
       │
       ├── connection
       ├── join_chat
       ├── send_message
       ├── receive_message
       └── disconnect
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
```

---

# Current Learning Milestone

- Express application setup
- HTTP server creation
- Socket.IO initialization
- WebSocket connection lifecycle
- Event-driven architecture
- Socket event handling
- Real-time message broadcasting
- Online users synchronization
- In-memory state management using `Map`

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

---

## Server URL

```text
http://localhost:3000
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

# Design Principles

- Event-driven architecture
- Separation of HTTP and WebSocket responsibilities
- Type-safe event payloads using TypeScript
- In-memory state management for connected users
- Clean separation of concerns
- Scalable foundation for future features

---

# Upcoming Features

- Remove disconnected users from the online users list
- Join/Leave notifications
- Typing indicator
- Auto-scroll support
- Message timestamps
- User avatars
- Chat rooms
- Private messaging
- JWT authentication
- MongoDB persistence
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- File sharing
- Read receipts
- Message history

---

# Future Architecture

```text
                        React Client

                              │

                        Socket.IO Client

                              │

══════════════════════════════════════════════

                    WebSocket

══════════════════════════════════════════════

                              │

                        Socket.IO Server

                              │

       ┌──────────────┬──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼

 Connected Users   Messages      Chat Rooms

       │              │              │

       ▼              ▼              ▼

     MongoDB       MongoDB       Redis Adapter
      (Later)       (Later)        (Later)
```

---

# Current Status

✅ Express Server

✅ HTTP Server

✅ Socket.IO Server

✅ Client Connections

✅ Join Chat Event

✅ Send Message Event

✅ Receive Message Broadcast

✅ Online Users Synchronization

🚧 Disconnect Cleanup

🚧 Typing Indicator

🚧 Chat Rooms

🚧 Authentication

🚧 MongoDB Persistence

🚧 Redis Scaling