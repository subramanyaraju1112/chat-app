import { useState, type ChangeEvent } from "react";

interface ChatBoxProps {
    onSendMessage: (message: string) => void;
}

const ChatBox = ({ onSendMessage }: ChatBoxProps) => {
    const [message, setMessage] = useState("");

    const handleOnChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        onSendMessage(trimmedMessage);

        setMessage("");
    };

    return (
        <div className="border-t bg-white p-5">

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