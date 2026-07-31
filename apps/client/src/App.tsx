import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import { socket } from "./socket/socket";
import type { ChatMessage } from "./types/message";
import MessageList from "./components/MessageList";

function App() {

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        data,
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [])

  const handleSendMessage = (message: string) => {
    socket.emit("send_message", {
      username: "Subramanya",
      message,
    });
  }

  return (
    <div>
      <ChatBox onSendMessage={handleSendMessage} />
      <MessageList messages={messages} />
    </div>
  );
}

export default App;