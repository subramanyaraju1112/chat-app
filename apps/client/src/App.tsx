import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import { socket } from "./socket/socket";
import type { ChatMessage } from "./types/message";
import MessageList from "./components/MessageList";
import JoinChat from "./components/JoinChat";

function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleRecieveMessage = (data: ChatMessage) => {
    setMessages((previousMessages) => [
      ...previousMessages, data,
    ])
  }

  const handleJoinChat = (username: string) => {
    setUsername(username);
    socket.emit("join_chat", {
      username
    });
    setIsJoined(true);
  }

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receive_message", handleRecieveMessage);

    return () => {
      socket.off("connect");
      socket.off("receive_message", handleRecieveMessage);
      socket.disconnect();
    };
  }, [])

  const handleSendMessage = (message: string) => {
    socket.emit("send_message", {
      username,
      message,
    });
  }

  return (
    <div>
      {!isJoined ? <JoinChat onJoin={handleJoinChat} /> : (
        <>
          <ChatBox onSendMessage={handleSendMessage} />
          <MessageList messages={messages} />
        </>
      )}
    </div>
  );
}

export default App;