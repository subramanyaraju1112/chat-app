# Client

The client is a React application built with Vite and TypeScript. It provides the user interface for the chat application and communicates with the Socket.IO server using a persistent WebSocket connection.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

## Responsibilities

- Establish a Socket.IO connection with the server
- Emit client events
- Listen for server events
- Manage application state
- Render the chat interface
- Display real-time online users

## Current Features

### Authentication (Local Session)

- Join Chat screen
- Username validation
- Join chat event

### Socket.IO

- Manual socket connection
- Connection lifecycle handling
  - Connect
  - Disconnect
- Send message
- Receive message
- Listen for online users updates

### Chat

- Send messages
- Receive real-time messages
- Display chat messages
- Real-time online users sidebar

### UI

- Responsive Join Chat screen
- Modern chat layout
- Sidebar
- Message list
- Chat input
- Tailwind CSS styling

## Folder Structure

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
│       ├── OnlineUsers.tsx
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