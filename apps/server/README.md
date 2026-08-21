# Server

The server is a Node.js application built with Express, TypeScript, Socket.IO, and MongoDB.

It acts as the central authority for the chat application by managing the HTTP server, maintaining WebSocket connections, tracking connected users, managing Socket.IO rooms, handling real-time events, persisting messages, loading message history, and managing database connectivity.

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
- Track the current room of each connected socket
- Manage Socket.IO room membership
- Remove disconnected users
- Broadcast online user updates
- Receive and broadcast chat messages
- Generate unique message IDs
- Generate server-side message timestamps
- Persist messages in MongoDB
- Load room-specific message history
- Generate and persist system messages
- Broadcast typing status
- Route events to the user's current room
- Establish MongoDB connection
- Provide a foundation for future REST APIs

---

# Architecture

```text
                         React Client
                              │
                              │
                       Socket.IO Client
                              │
                              │
══════════════════════════════════════════════
             Persistent WebSocket Connection
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
                         ┌─────────────────┼─────────────────┐
                         │                 │                 │
                         ▼                 ▼                 ▼
                   User Presence        Rooms          Real-time Events
                         │                 │                 │
                         ▼                 ▼          ┌──────┼──────┐
                     Map Store       Room Membership   │      │      │
                                                       ▼      ▼      ▼
                                                   Messages Typing System
                                                       │
                                                       ▼
                                                Message Service
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
- Node.js HTTP server
- Socket.IO attached to the HTTP server
- CORS configuration for the React client
- Environment variable configuration using dotenv
- Database-first server startup

---

## Socket.IO

- Client connection handling
- Client disconnection handling
- Join chat event
- Join room event
- Room switching
- Online users broadcast
- Send message event
- Receive message broadcast
- Message history
- Typing event
- Stop typing event
- Join system message
- Leave system message
- Room-specific broadcasting

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
connectedUsers.set(
    socket.id,
    username
);
```

When a user disconnects:

```ts
connectedUsers.delete(socket.id);
```

After users join or disconnect, the server broadcasts the updated user list:

```ts
io.emit(
    "online_users",
    [...connectedUsers.values()]
);
```

The Map represents active users connected to the current server instance.

---

# Connected User Rooms

The server also maintains an in-memory Map to track the current room of each connected socket:

```ts
const connectedUserRooms = new Map<string, string>();
```

The Map stores:

```text
socket.id → room
```

Example:

```text
socket_123 → general
socket_456 → technology
socket_789 → gaming
```

When a user joins a room:

```ts
connectedUserRooms.set(
    socket.id,
    room
);
```

When a user disconnects:

```ts
connectedUserRooms.delete(
    socket.id
);
```

This allows the server to determine the user's current room for room-specific operations.

---

# Socket.IO Rooms

The application uses Socket.IO rooms to isolate chat communication.

Example rooms:

```text
general
technology
gaming
```

A client requests to join a room:

```ts
socket.emit("join_room", {
    room: "general",
});
```

The server then joins the socket to that room:

```ts
socket.join(room);
```

The server also tracks the current room:

```ts
connectedUserRooms.set(
    socket.id,
    room
);
```

---

# Room Switching

When a user switches rooms, the server:

1. Determines the user's previous room
2. Leaves the previous Socket.IO room
3. Joins the new room
4. Updates `connectedUserRooms`
5. Loads the new room's message history
6. Sends the message history to the client
7. Creates a system message indicating that the user joined the new room

Flow:

```text
Client
   │
   │ join_room("technology")
   ▼
Server
   │
   ├── Get Previous Room
   │
   ├── Leave Previous Room
   │
   ├── Join Technology
   │
   ├── Update Room Map
   │
   ├── Load Technology History
   │
   └── Create Join System Message
```

The server prevents duplicate room joins:

```ts
if (previousRoom === room) {
    return;
}
```

---

# Server-Side Room Resolution

The server maintains the current room for every connected socket.

```text
socket.id
    │
    ▼
connectedUserRooms
    │
    ▼
current room
```

For example:

```text
socket_123 → general
socket_456 → technology
```

The server uses this information for room-specific operations.

The client sends:

```ts
socket.emit("send_message", {
    username,
    message,
});
```

The server determines the current room from the socket:

```ts
const room =
    connectedUserRooms.get(socket.id);
```

The message is then persisted and broadcast to that room.

This ensures that room routing is controlled by the server.

---

# Message Broadcasting

Normal messages are broadcast only to users in the current room.

```ts
io.to(room).emit(
    "receive_message",
    message
);
```

Example:

```text
Alice
  │
  │ send_message
  ▼
Server
  │
  ▼
Current Room = general
  │
  ▼
io.to("general")
  │
  ├── Alice
  ├── Bob
  └── Charlie
```

Users in other rooms do not receive the message.

---

# MongoDB

MongoDB is used as the persistent database layer for the chat application.

The server uses Mongoose to establish and manage the MongoDB connection.

MongoDB stores:

- Normal chat messages
- System messages
- Room information
- Message IDs
- Message timestamps

---

# Database Connection

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

The MongoDB connection is configured through:

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

# Message Service

Database-related message operations are separated into the message service.

```text
src/

├── services/
│   └── message.service.ts
```

The message service currently provides:

```ts
createMessage()
createSystemMessage()
getMessages()
```

---

# Create Message

The `createMessage()` service is responsible for creating and persisting normal chat messages.

```ts
createMessage({
    username,
    message,
    room,
});
```

The service generates:

- Unique message ID
- Message type
- Timestamp

The message is then saved to MongoDB.

---

# Create System Message

The `createSystemMessage()` service is responsible for creating and persisting system messages.

```ts
createSystemMessage({
    message,
    room,
});
```

System messages are used for events such as:

```text
Alice joined the chat
```

and:

```text
Alice left the chat
```

System messages are also persisted in MongoDB.

---

# Get Messages

Room-specific message history is loaded using:

```ts
getMessages(room);
```

The service retrieves messages for the requested room.

Messages are sorted chronologically and limited to the latest 50 messages.

```text
MongoDB
   │
   ▼
Filter by Room
   │
   ▼
Sort by Timestamp
   │
   ▼
Latest 50 Messages
   │
   ▼
Return to Socket Handler
```

---

# Message Persistence Flow

When a client sends a message:

```text
Client
   │
   │ send_message
   ▼
Socket.IO Server
   │
   ▼
Determine Current Room
   │
   ▼
createMessage()
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
Clients in Same Room
```

The server saves the message before broadcasting it.

---

# Message History Flow

When a client joins a room:

```text
Client
   │
   │ join_room
   ▼
Socket.IO Server
   │
   ▼
getMessages(room)
   │
   ▼
MongoDB
   │
   ▼
Latest 50 Room Messages
   │
   ▼
message_history
   │
   ▼
Joining Client
```

The message history is specific to the selected room.

---

# Message Types

The application currently supports two message types:

```text
message
system
```

---

## Normal Message

A normal user-generated message contains:

```ts
{
    id: "...",
    type: "message",
    username: "Subramanya",
    message: "Hello Socket.IO 👋",
    room: "general",
    timestamp: "..."
}
```

The server is responsible for generating:

- `id`
- `type`
- `timestamp`
- `room`

---

## System Message

A system-generated message contains:

```ts
{
    id: "...",
    type: "system",
    message: "Alice joined the chat",
    room: "general",
    timestamp: "..."
}
```

System messages are generated by the server for events such as:

- User joining a room
- User leaving a room

System messages are persisted in MongoDB.

---

# Join Chat

When a user joins the application:

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
   └── Broadcast online_users
```

The `join_chat` event registers the username against the socket:

```ts
connectedUsers.set(
    socket.id,
    data.username
);
```

The server then broadcasts the updated online users:

```ts
io.emit(
    "online_users",
    [...connectedUsers.values()]
);
```

Room membership is handled separately through `join_room`.

---

# Join Room

When a user joins a room:

```text
Client
   │
   ▼
join_room
   │
   ▼
Server
   │
   ├── Determine Previous Room
   │
   ├── Leave Previous Room
   │
   ├── Join New Room
   │
   ├── Track Current Room
   │
   ├── Load Message History
   │
   └── Create Join System Message
```

The server joins the socket:

```ts
socket.join(room);
```

and tracks the room:

```ts
connectedUserRooms.set(
    socket.id,
    room
);
```

The server then loads the room history and sends it to the joining client:

```ts
socket.emit(
    "message_history",
    formattedMessages
);
```

A join system message is then created and broadcast to the room.

---

# Room Switching

When a user changes rooms:

```text
Client
   │
   │ join_room("technology")
   ▼
Server
   │
   ├── Get Previous Room
   │
   ├── Leave Previous Room
   │
   ├── Join Technology
   │
   ├── Update connectedUserRooms
   │
   ├── Load Technology History
   │
   └── Create Join System Message
```

This prevents users from continuing to receive messages from their previous room.

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
   ├── Get Username
   │
   ├── Get Current Room
   │
   ├── Remove User
   │
   ├── Remove Room Tracking
   │
   ├── Persist Leave System Message
   │
   └── Broadcast Updated Online Users
```

The server retrieves the information before deleting it:

```ts
const username =
    connectedUsers.get(socket.id);

const room =
    connectedUserRooms.get(socket.id);

connectedUsers.delete(socket.id);
connectedUserRooms.delete(socket.id);
```

If the username and room exist, a leave system message is created:

```text
Alice left the chat
```

The message is persisted and broadcast to the remaining users in that room.

---

# Typing Indicator

Typing status is treated as ephemeral real-time state.

Typing events are not stored in MongoDB.

---

## User Starts Typing

The client emits:

```text
typing
```

The server determines the user's current room:

```ts
const room =
    connectedUserRooms.get(socket.id);
```

The server then broadcasts the typing event to other users in that room:

```ts
socket.to(room).emit(
    "user_typing",
    {
        username: data.username,
    }
);
```

The sender does not receive their own typing event.

---

## User Stops Typing

The client emits:

```text
stop_typing
```

The server determines the current room and broadcasts:

```ts
socket.to(room).emit(
    "user_stopped_typing",
    {
        username: data.username,
    }
);
```

This allows other clients in the same room to remove the typing indicator.

---

# Why `socket.to(room)`?

Typing events are room-specific.

If Alice is typing in:

```text
general
```

users in:

```text
technology
gaming
```

should not receive Alice's typing status.

Therefore:

```ts
socket.to(room).emit(...)
```

is used.

The sender is excluded because the sender already knows that they are typing.

---

# Socket.IO Broadcasting

The server uses different Socket.IO broadcasting methods depending on the event.

## `io.emit()`

Used when every connected client should receive the event.

Example:

```ts
io.emit(
    "online_users",
    users
);
```

---

## `io.to(room).emit()`

Used when every user in a specific room should receive the event.

Example:

```ts
io.to(room).emit(
    "receive_message",
    message
);
```

---

## `socket.to(room).emit()`

Used when users in a specific room should receive an event except the sender.

Example:

```ts
socket.to(room).emit(
    "user_typing",
    {
        username,
    }
);
```

---

# Socket Events

| Event | Direction | Description |
|---|---|---|
| `connection` | Client → Server | Fired when a client establishes a socket connection |
| `join_chat` | Client → Server | Registers the user's username |
| `online_users` | Server → Client | Broadcasts the current online users |
| `join_room` | Client → Server | Requests to join a chat room |
| `message_history` | Server → Client | Sends room-specific message history |
| `send_message` | Client → Server | Sends a chat message |
| `receive_message` | Server → Client | Broadcasts a normal or system message |
| `typing` | Client → Server | Indicates that a user is typing |
| `user_typing` | Server → Client | Notifies users in the same room that a user is typing |
| `stop_typing` | Client → Server | Indicates that a user stopped typing |
| `user_stopped_typing` | Server → Client | Notifies users that typing stopped |
| `disconnect` | Client → Server | Handles socket disconnection |

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
   └── Broadcast online_users
```

---

## User Joins Room

```text
Client
   │
   ▼
join_room
   │
   ▼
Server
   │
   ├── Check Previous Room
   │
   ├── Leave Previous Room
   │
   ├── Join New Room
   │
   ├── Update connectedUserRooms
   │
   ├── Load Message History
   │
   └── Create Join System Message
            │
            ▼
       receive_message
            │
            ▼
       Room Participants
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
   ├── Determine Current Room
   │
   ├── Create Message
   │
   ├── Persist Message
   │
   └── Broadcast to Current Room
            │
            ▼
       receive_message
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
   ├── Determine Current Room
   │
   └── socket.to(room)
            │
            ▼
       user_typing
            │
            ▼
       Other Room Members
```

---

## User Stops Typing

```text
Client
   │
   ▼
stop_typing
   │
   ▼
Server
   │
   ├── Determine Current Room
   │
   └── socket.to(room)
            │
            ▼
   user_stopped_typing
            │
            ▼
       Other Room Members
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
   ├── Get Username
   │
   ├── Get Current Room
   │
   ├── Remove User
   │
   ├── Remove Room Tracking
   │
   ├── Persist Leave Message
   │
   ├── Broadcast Leave Message
   │
   └── Broadcast online_users
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
       Server Startup Fails
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
│
├── services/
│   └── message.service.ts
│
├── middleware/
├── utils/
│
├── models/
│   └── message.ts
│
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
├── Connected User Rooms
│      │
│      └── socket.id → room
│
├── Socket.IO Rooms
│      │
│      ├── general
│      ├── technology
│      └── gaming
│
├── Message Service
│      │
│      ├── createMessage()
│      ├── createSystemMessage()
│      └── getMessages()
│
└── Socket Events
       │
       ├── connection
       ├── join_chat
       ├── online_users
       ├── join_room
       ├── message_history
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

# Environment Variables

Create a `.env` file in the server root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/socket-chat
```

For production, use the appropriate MongoDB connection string.

Do not commit `.env` to Git.

---

# Start Development Server

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

## Development

```bash
pnpm dev
```

Starts the development server with hot reload.

---

## Build

```bash
pnpm build
```

Compiles the TypeScript project.

---

## Production

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
- Join and leave system messages
- Message persistence
- Message history
- Room-specific message persistence
- Socket.IO rooms
- Room switching
- Room membership tracking
- Server-side room resolution
- Real-time typing events
- Room-specific typing indicators
- `socket.to(room).emit()` usage
- `io.to(room).emit()` usage
- `io.emit()` usage
- Separation of persistent and ephemeral events
- MongoDB connection
- Mongoose integration
- Message service architecture
- Environment-based database configuration
- Database-first server startup

---

# Design Principles

- Event-driven architecture
- Separation of HTTP and WebSocket responsibilities
- Type-safe event payloads using TypeScript
- In-memory state management for active connections
- Server-authoritative room membership
- Server-authoritative message routing
- Server-generated message metadata
- Separation of persistent messages and ephemeral events
- Separation of socket communication and database logic
- Environment-based configuration
- Clean separation of concerns
- Room-specific event broadcasting
- Database-backed message history
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

✅ Message Persistence

✅ Message History

✅ Message Service

✅ Socket.IO Chat Rooms

✅ Room Switching

✅ Room Membership Tracking

✅ Room-specific Message Broadcasting

✅ Room-specific Message History

✅ Room-specific Typing Indicators

✅ Server-side Room Resolution

🚧 Private Messaging

🚧 Authentication

🚧 Authorization

🚧 Redis Pub/Sub

🚧 Socket.IO Redis Adapter

🚧 Horizontal Scaling

🚧 File Sharing

🚧 Read Receipts

🚧 Message Reactions

---

# Upcoming Features

- JWT authentication
- User authentication and authorization
- Private messaging
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- Message pagination
- File sharing
- Read receipts
- Message reactions
- User avatars
- Rate limiting
- Production monitoring
- REST APIs
- Distributed room state

---

# Future Architecture

```text
                         React Clients
                              │
                              ▼
                         Load Balancer
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
         Node.js #1       Node.js #2       Node.js #3
             │                │                │
             └────────────────┼────────────────┘
                              │
                       Socket.IO Redis
                           Adapter
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                  Redis             MongoDB
              Pub/Sub / State     Message Storage
```

The future architecture will allow the application to scale horizontally across multiple Node.js instances while maintaining real-time communication between connected clients.

---

# Current Architecture Summary

```text
                         React Client
                              │
                              ▼
                       Socket.IO Client
                              │
                              ▼
                     Node.js HTTP Server
                              │
                     ┌────────┴────────┐
                     │                 │
                     ▼                 ▼
                 Express           Socket.IO
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
              User Presence       Room Management     Real-time Events
                    │                  │                  │
                    ▼                  ▼            ┌─────┼─────┐
              connectedUsers    connectedUserRooms  │     │     │
                                                     ▼     ▼     ▼
                                                 Messages Typing System
                                                     │
                                                     ▼
                                               Message Service
                                                     │
                                                     ▼
                                                  Mongoose
                                                     │
                                                     ▼
                                                   MongoDB
```

The current architecture provides a foundation for a persistent, room-based, real-time chat application with server-controlled room routing and MongoDB-backed message history.
