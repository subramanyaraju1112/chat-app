import { useState, type ChangeEvent } from "react";

interface ChatBoxProps {
    typingUser: string | null;
    onTyping: () => void;
    onSendMessage: (message: string) => void;
}

const ChatBox = ({ typingUser, onTyping, onSendMessage }: ChatBoxProps) => {
    const [message, setMessage] = useState("");

    const handleOnChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        setMessage(value);

        if (value.trim()) {
            onTyping();
        }
    };

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        onSendMessage(trimmedMessage);

        setMessage("");
    };

    return (
        <div className="border-t bg-white p-5">

            {typingUser && (
                <p className="mb-2 text-sm text-slate-400">
                    {typingUser} is typing...
                </p>
            )}

            <div className="flex items-center gap-4">

                <input
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleOnChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />

                <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                >
                    Send
                </button>

            </div>

        </div>
    );
};

export default ChatBox;