import Sidebar from "../sidebar/Sidebar";
import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import { type ChatMessage } from "../../types/message";

interface ChatLayoutProps {
  username: string;
  room: string;
  messages: ChatMessage[];
  onlineUsers: string[];
  typingUser: string | null;
  onRoomChange: (room: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  onSendMessage: (message: string) => void;
}

const ChatLayout = ({
  username,
  room,
  messages,
  onlineUsers,
  typingUser,
  onRoomChange,
  onTyping,
  onStopTyping,
  onSendMessage,
}: ChatLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar onlineUsers={onlineUsers}
        currentRoom={room}
        onRoomChange={onRoomChange} />

      <main className="flex flex-1 flex-col">

        {/* Header */}

        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              #{room}
            </h1>

            <p className="text-sm text-slate-500">
              Welcome to Socket.IO Chat
            </p>
          </div>
        </header>

        <MessageList username={username} messages={messages} />

        {typingUser && (
          <div className="border-t bg-white px-6 py-2">
            <p className="text-sm text-slate-500">
              {typingUser} is typing...
            </p>
          </div>
        )}

        <ChatBox onSendMessage={onSendMessage}
          onTyping={onTyping}
          onStopTyping={onStopTyping} />

      </main>

    </div>
  );
};

export default ChatLayout;