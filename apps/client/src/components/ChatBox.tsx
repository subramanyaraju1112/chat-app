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
        <div>
            <input
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

            <button onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

export default ChatBox