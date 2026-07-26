# Client

The client is a React application built with Vite and TypeScript. It is responsible for providing the user interface and establishing a real-time connection with the Socket.IO server.

## Tech Stack

- React
- TypeScript
- Vite
- Socket.IO Client

## Responsibilities

- Connect to the Socket.IO server
- Listen for server events
- Emit client events
- Render the chat interface

## Current Features

- Socket.IO client setup
- Manual socket connection
- Connection lifecycle handling
  - Connect
  - Disconnect

## Folder Structure

```text
src/
├── socket/
│   └── socket.ts
├── App.tsx
└── main.tsx
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

The application runs on:

```
http://localhost:5173
```

## Current Learning Milestone

- React application setup
- Socket.IO client initialization
- Client successfully connects to the Socket.IO server
- Connection lifecycle events

## Upcoming Features

- Send Message
- Receive Message
- Chat UI
- Multiple Users
- Chat Rooms
- Authentication