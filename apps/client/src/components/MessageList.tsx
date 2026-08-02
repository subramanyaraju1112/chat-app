import { type ChatMessage } from "../types/message";
import ChatMessageItem from "./ChatMessage";

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-6">

            <div className="space-y-6">

                {messages.map((message, index) => (
                    <ChatMessageItem
                        key={index}
                        message={message}
                    />
                ))}

            </div>

        </div>
    );
};

export default MessageList;