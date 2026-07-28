import { useState } from "react";
interface ChatBoxProps {
  onSendMessage: (message: string) => void;
}

const ChatBox = ({ onSendMessage }: ChatBoxProps) => {
  const [message, setMessage] = useState("");

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
        onChange={(event) => setMessage(event.target.value)}
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