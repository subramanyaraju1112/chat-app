# Server

Backend service for the real-time chat application, built with Node.js, Express, TypeScript, Socket.IO, MongoDB, Mongoose, JWT, bcrypt, and dotenv.

The server handles authentication, real-time communication, chat rooms, message persistence, online users, typing indicators, and system notifications.

## Tech Stack
- Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB / Mongoose
- JWT / bcrypt
- dotenv

## Features
### Authentication
- User registration and password hashing with bcrypt
- User login and JWT access token generation
- Centralized JWT generation and verification
- Protected authentication APIs
- Socket.IO authentication middleware
- Environment-based JWT configuration
### Real-Time Chat
- Socket.IO connections and real-time messaging
- Online user tracking
- Typing indicators
- Join/leave notifications and system messages
- Disconnect handling
### Chat Rooms
- Multiple rooms and room switching
- Room-specific messaging and typing indicators
- Server-side room tracking
- Server-controlled message routing
### Persistence
- MongoDB/Mongoose integration
- User, message, and system-message persistence
- Room-specific message history
- Latest 50 messages per room

## Architecture
```text
React Client
    │
Socket.IO Client
    │
Node.js HTTP Server
    ├── Express ── Authentication Routes ── Auth Service ── User Model ── MongoDB
    └── Socket.IO ── Users / Rooms / Messages ── Message Service ── MongoDB
```
Express handles HTTP APIs, while Socket.IO manages persistent real-time connections.

## Authentication
### Register
`POST /api/auth/register`
```json
{"username":"alice","email":"alice@example.com","password":"password123"}
```
### Login
`POST /api/auth/login`
```json
{"email":"alice@example.com","password":"password123"}
```
Login validates credentials and returns a JWT access token.

### JWT Utility
JWT generation and verification are centralized in `src/utils/jwt.ts`.

Current JWT payload:
```ts
{ userId: string; username: string }
```

### Protected API
`GET /api/auth/me`

`auth.middleware.ts` reads the JWT, verifies it, extracts the authenticated user, and allows the request to continue when authentication succeeds.

### Socket.IO Authentication
`socket.middleware.ts` reads the token from `socket.handshake.auth.token`, verifies it before the `connection` handler runs, and attaches the authenticated identity to the socket:
```ts
socket.user = { userId, username };
```

Flow:
```text
Client → Socket.IO Handshake → authenticateSocket()
      → verifyAccessToken() → socket.user → connection
```

The next authentication step is connecting the client login flow to this Socket.IO handshake.

## Socket.IO Events
| Event | Direction | Purpose |
|---|---|---|
| `join_chat` | Client → Server | Register chat username |
| `online_users` | Server → Client | Update online users |
| `join_room` | Client → Server | Join a room |
| `message_history` | Server → Client | Send room history |
| `send_message` | Client → Server | Send message |
| `receive_message` | Server → Client | Receive message |
| `typing` | Client → Server | Start typing |
| `user_typing` | Server → Client | Typing notification |
| `stop_typing` | Client → Server | Stop typing |
| `user_stopped_typing` | Server → Client | Remove typing indicator |
| `disconnect` | Server | Handle disconnect |

## Room Management
The server tracks each socket's current room using `socket.id → room`.

Example: `socket_123 → general`.

When switching rooms, the server leaves the previous room, joins the new room, updates tracking, loads history, sends history to the client, and creates a join system message.

Messages are broadcast only to users in the current room.

## Message Flow
```text
Client
  │ send_message
  ▼
Socket.IO Server
  ▼
Message Service
  ▼
MongoDB
  ▼
receive_message
  ▼
Room Members
```

Message structure:
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

## Project Structure
```text
src/
├── app.ts
├── server.ts
├── config/database.ts
├── controllers/auth.controller.ts
├── models/
│   ├── message.ts
│   └── user.ts
├── routes/auth.routes.ts
├── services/
│   ├── auth.service.ts
│   └── message.service.ts
├── sockets/index.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── socket.middleware.ts
├── utils/jwt.ts
└── types/
```

## Environment Variables
Create `.env` in the server root:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/socket-chat
JWT_SECRET=your-generated-secret
JWT_EXPIRES_IN=15m
```
Generate a secure JWT secret with `openssl rand -base64 64`.

Never commit `.env`. Use `.env.example`:
```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=15m
```

## Getting Started
```bash
pnpm install
pnpm dev
```
Build with `pnpm build` and run production with `pnpm start`.

Server: `http://localhost:3000`  
Client: `http://localhost:5173`

## Database
MongoDB stores persistent application data.

Current collections:
- `users`
- `messages`

Message history is queried by room and limited to the latest 50 messages.

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
- ✅ Server-side room tracking

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
- ✅ Centralized JWT utility
- ✅ JWT verification
- ✅ Protected `/api/auth/me`
- ✅ Socket.IO authentication middleware
- 🚧 Client JWT → Socket.IO handshake
- 🚧 Authenticated socket identity throughout chat events
- 🚧 Refresh tokens
- 🚧 Authorization

## Roadmap
### Authentication
- Connect client login with Socket.IO authentication
- Derive socket identity from `socket.user`
- Remove client-provided username from trusted socket events
- Implement authorization
- Add refresh token flow
### Messaging
- Private messaging
- Message pagination
- Delivery/read status
- Message editing and deletion
### Scalability
- Redis Pub/Sub
- Socket.IO Redis Adapter
- Horizontal scaling
- Rate limiting
### Infrastructure
- Docker deployment
- CI/CD
- Production monitoring
- Automated testing

## Future Architecture
```text
                    Load Balancer
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
         Node.js #1   Node.js #2   Node.js #3
             └────────────┼────────────┘
                          │
                 Socket.IO Redis Adapter
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  Redis      MongoDB
               Pub/Sub      Persistence
```

The application is designed to evolve from a single Node.js instance into a horizontally scalable real-time system.

## Future Authentication Architecture
```text
Client
  │
  ▼
Login API
  │
  ▼
Access Token
  ├── HTTP Requests → JWT Middleware ──┐
  └── Socket.IO → Socket Middleware ───┤
                                      ▼
                              Authenticated User
                                      │
                                      ▼
                                  socket.user
```

The server should derive user identity from the verified JWT rather than trusting identity information supplied by the client.

## Future Scalable Architecture
```text
Client Applications
        │
        ▼
Load Balancer
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Node 1 Node 2 Node 3
 └──────┼──────┘
        ▼
Socket.IO Adapter
        │
      Redis
     /      Pub/Sub  State
        │
        ▼
     MongoDB
```

Redis will coordinate cross-instance Socket.IO communication while MongoDB remains the persistence layer.
