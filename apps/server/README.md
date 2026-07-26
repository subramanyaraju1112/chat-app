# Server

The server is a Node.js application built with Express, TypeScript, and Socket.IO.

It provides both REST endpoints and real-time communication using WebSockets through Socket.IO.

## Tech Stack

- Node.js
- Express
- TypeScript
- Socket.IO

## Responsibilities

- Start the HTTP server
- Initialize the Socket.IO server
- Handle socket connections
- Manage real-time events
- Serve REST APIs (future)

## Architecture

```text
Browser
    │
    ▼
Node HTTP Server
    │
 ┌──┴──────────────┐
 │                 │
 ▼                 ▼
Express        Socket.IO
Routes          Events
```

## Current Features

- Express server
- HTTP server
- Socket.IO server initialization
- Client connection handling
- Client disconnection handling

## Folder Structure

```text
src/
├── app.ts
├── server.ts
├── sockets/
│   └── index.ts
├── controllers/
├── routes/
├── services/
├── middleware/
├── utils/
├── config/
└── types/
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The server runs on:

```
http://localhost:3000
```

## Current Learning Milestone

- Express application setup
- HTTP server creation
- Socket.IO initialization
- Client connection established
- Connection lifecycle events

## Upcoming Features

- Custom Socket Events
- Send Message
- Broadcast Messages
- Chat Rooms
- Authentication
- MongoDB Integration
- Redis Adapter