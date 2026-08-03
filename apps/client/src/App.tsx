import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import type { ChatMessage } from "./types/message";
import JoinChat from "./components/auth/JoinChat";
import ChatLayout from "./components/chat/ChatLayout";

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
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

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users)
    })


    return () => {
      socket.off("connect");
      socket.off("receive_message", handleRecieveMessage);
      socket.off("online_users")
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
          <ChatLayout
            messages={messages}
            onlineUsers={onlineUsers}
            onSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
}

export default App;