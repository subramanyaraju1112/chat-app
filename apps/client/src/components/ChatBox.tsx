import { useState, type ChangeEvent } from "react";
interface ChatBoxProps {
    onSendMessage: (message: string) => void;
}

const ChatBox = ({ onSendMessage }: ChatBoxProps) => {
    const [message, setMessage] = useState("");

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value)
    }

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        onSendMessage(trimmedMessage);

        setMessage("");
    };

    return (
        <div className="border-t bg-white p-5">
            <div className="flex gap-4">
                <input
                    className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleOnChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />

                <button className="rounded-xl bg-blue-600 px-8 text-white transition hover:bg-blue-700" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>

    );
};

export default ChatBox