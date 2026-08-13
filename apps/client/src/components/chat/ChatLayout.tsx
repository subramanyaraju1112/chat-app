import Sidebar from "../sidebar/Sidebar";
import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import { type ChatMessage } from "../../types/message";

interface ChatLayoutProps {
  username: string;
  messages: ChatMessage[];
  onlineUsers: string[];
  typingUser: string | null;
  onStopTyping: () => void;
  onSendMessage: (message: string) => void;
  onTyping: () => void;
}

const ChatLayout = ({
  username,
  messages,
  onlineUsers,
  typingUser,
  onSendMessage,
  onTyping,
  onStopTyping
}: ChatLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar onlineUsers={onlineUsers} />

      <main className="flex flex-1 flex-col">

        {/* Header */}

        <header className="flex items-center justify-between border-b bg-white px-6 py-4">

          <div>

            <h1 className="text-xl font-semibold text-slate-800">
              General Chat
            </h1>

            <p className="text-sm text-slate-500">
              Welcome to Socket.IO Chat
            </p>

          </div>

        </header>

        <MessageList username={username} messages={messages} />

        <ChatBox onSendMessage={onSendMessage} onTyping={onTyping} onStopTyping={onStopTyping}
          typingUser={typingUser} />

      </main>

    </div>
  );
};

export default ChatLayout;