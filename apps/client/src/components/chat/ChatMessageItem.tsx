import { type ChatMessage } from "../../types/message";

interface ChatMessageItemProps {
    username: string;
    message: ChatMessage;
}

const ChatMessageItem = ({ username, message }: ChatMessageItemProps) => {
    const isOwnMessage = message.username === username;
    return (
        <div
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`max-w-md rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-800"
                    }`}
            >
                <p
                    className={`mb-1 text-xs font-medium ${isOwnMessage
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                >
                    {isOwnMessage ? "You" : message.username}
                </p>

                <p className="wrap-break-word">
                    {message.message}
                </p>

                <p
                    className={`mt-1 text-xs ${isOwnMessage
                            ? "text-blue-100"
                            : "text-slate-400"
                        }`}
                >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
};

export default ChatMessageItem;