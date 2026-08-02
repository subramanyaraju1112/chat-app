import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import {type ChatMessage } from "../types/message";

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

      <div className="flex flex-1 flex-col">

        <MessageList messages={messages} />

        <ChatBox onSendMessage={onSendMessage} />

      </div>

    </div>
  );
};

export default ChatLayout;