# Server

Backend service for the real-time chat application, built with Node.js, Express, TypeScript, Socket.IO, MongoDB, and JWT.

The server handles authentication, real-time communication, chat rooms, message persistence, online users, typing indicators, and system notifications.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv

---

## Features

### Authentication

- User registration
- Password hashing with bcrypt
- User login
- JWT access token generation
- Environment-based JWT configuration

### Real-Time Chat

- Socket.IO connections
- Real-time messaging
- Online user tracking
- Typing indicators
- Join/leave notifications
- System messages
- Disconnect handling

### Chat Rooms

- Multiple chat rooms
- Room switching
- Room-specific messaging
- Room-specific typing indicators
- Server-side room tracking
- Server-controlled message routing

### Persistence

- MongoDB integration
- User persistence
- Message persistence
- System message persistence
- Room-specific message history
- Latest 50 messages per room

---

## Architecture

```text
                         React Client
                              │
                              ▼
                       Socket.IO Client
                              │
                              ▼
                      Node.js Server
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             ▼                                 ▼
         Express                           Socket.IO
             │                                 │
             ▼                         ┌───────┼────────┐
      Authentication                  │       │        │
          Routes                     Users   Rooms   Messages
             │                                 │        │
             ▼                                 │        ▼
       Auth Service                            │   Message Service
             │                                 │        │
             ▼                                 │        ▼
        User Model                             └── MongoDB
```

---

## Authentication

### Register

```http
POST /api/auth/register
```

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

Login returns a JWT access token.

```text
Client
  │
  ▼
Login
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT
  │
  ▼
Access Token
```

> JWT verification middleware and authenticated Socket.IO connections are planned next.

---

## Socket.IO

The server manages:

- User connections
- Online users
- Chat rooms
- Messages
- Typing indicators
- System notifications
- Disconnect cleanup

### Socket Events

| Event | Direction | Purpose |
|---|---|---|
| `join_chat` | Client → Server | Register username |
| `online_users` | Server → Client | Update online users |
| `join_room` | Client → Server | Join a room |
| `message_history` | Server → Client | Send room history |
| `send_message` | Client → Server | Send message |
| `receive_message` | Server → Client | Receive message |
| `typing` | Client → Server | Start typing |
| `user_typing` | Server → Client | Typing notification |
| `stop_typing` | Client → Server | Stop typing |
| `user_stopped_typing` | Server → Client | Remove typing indicator |
| `disconnect` | Client → Server | Handle disconnect |

---

## Room Management

The server tracks each socket's current room:

```text
socket.id → room
```

Example:

```text
socket_123 → general
socket_456 → technology
socket_789 → gaming
```

When switching rooms, the server:

1. Leaves the previous room
2. Joins the new room
3. Updates room tracking
4. Loads message history
5. Sends history to the client
6. Creates a join system message

Messages are broadcast only to users in the current room.

---

## Message Flow

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

Messages contain:

```ts
{
  id: string;
  type: "message" | "system";
  username?: string;
  message: string;
  room: string;
  timestamp: Date;
}
```

The server generates the message ID and timestamp.

---

## Project Structure

```text
src/
├── app.ts
├── server.ts
│
├── config/
│   └── database.ts
│
├── controllers/
│   └── auth.controller.ts
│
├── models/
│   ├── message.ts
│   └── user.ts
│
├── routes/
│   └── auth.routes.ts
│
├── services/
│   ├── auth.service.ts
│   └── message.service.ts
│
├── sockets/
│   └── index.ts
│
├── middleware/
├── utils/
└── types/
```

---

## Environment Variables

Create `.env` in the server root:

```env
PORT=3000

MONGODB_URI=mongodb://127.0.0.1:27017/socket-chat

JWT_SECRET=your-generated-secret
JWT_EXPIRES_IN=15m
```

Generate a secure JWT secret:

```bash
openssl rand -base64 64
```

Never commit `.env`.

Use `.env.example` for shared configuration:

```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=15m
```

---

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

Server:

```text
http://localhost:3000
```

Client:

```text
http://localhost:5173
```

---

## Database

MongoDB is used for persistent application data.

Current collections:

```text
users
messages
```

Message history is queried by room and limited to the latest 50 messages.

---

## Current Status

### Core Chat

- ✅ Socket.IO
- ✅ Real-time messaging
- ✅ Online users
- ✅ Typing indicators
- ✅ Join/leave notifications
- ✅ System messages
- ✅ Chat rooms
- ✅ Room switching

### Database

- ✅ MongoDB
- ✅ Mongoose
- ✅ Message persistence
- ✅ Message history
- ✅ User model

### Authentication

- ✅ Registration
- ✅ Password hashing
- ✅ Login
- ✅ JWT generation
- 🚧 JWT verification middleware
- 🚧 Protected APIs
- 🚧 Socket.IO authentication
- 🚧 Refresh tokens
- 🚧 Authorization

---

## Roadmap

- JWT verification middleware
- Authenticated Socket.IO connections
- Protected APIs
- Private messaging
- Message pagination
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- Rate limiting
- Automated testing
- Docker deployment
- CI/CD
- Production monitoring

---

## Future Architecture

```text
                       Load Balancer
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
         Node.js #1      Node.js #2      Node.js #3
             │               │               │
             └───────────────┼───────────────┘
                             │
                    Socket.IO Redis Adapter
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                  Redis            MongoDB
               Pub/Sub/State     Persistence
```

The architecture is designed to evolve from a single Node.js instance into a horizontally scalable real-time system.