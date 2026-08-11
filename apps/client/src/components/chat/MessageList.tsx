import { useEffect, useRef } from "react";
import { type ChatMessage } from "../../types/message";
import ChatMessageItem from "./ChatMessageItem";

interface MessageListProps {
    username: string;
    messages: ChatMessage[];
}

const MessageList = ({ username, messages }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">

            {messages.length === 0 ? (

                <div className="flex h-full items-center justify-center">

                    <p className="text-slate-400">
                        No messages yet. Start the conversation 👋
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    {messages.map((message) => (
                        <ChatMessageItem
                            key={message.id}
                            username={username}
                            message={message}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};

export default MessageList;