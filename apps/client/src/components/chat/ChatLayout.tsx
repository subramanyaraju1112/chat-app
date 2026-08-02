import Sidebar from "../sidebar/Sidebar";
import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import { type ChatMessage } from "../../types/message";

interface ChatLayoutProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const ChatLayout = ({
  messages,
  onSendMessage,
}: ChatLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

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

        <MessageList messages={messages} />

        <ChatBox onSendMessage={onSendMessage} />

      </main>

    </div>
  );
};

export default ChatLayout;