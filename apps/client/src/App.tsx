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
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const handleReceiveMessage = (data: ChatMessage) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      data,
    ]);
  };

  const handleJoinChat = (username: string) => {
    setUsername(username);

    socket.emit("join_chat", {
      username,
    });

    setIsJoined(true);
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receive_message", handleReceiveMessage);

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("message_history", (messages: ChatMessage[]) => {
      setMessages(messages);
    });

    socket.on("user_typing", ({ username }: { username: string }) => {
      setTypingUser(username);
    });

    socket.on(
      "user_stopped_typing",
      ({ username }: { username: string }) => {
        setTypingUser((currentUser) =>
          currentUser === username ? null : currentUser
        );
      }
    );

    return () => {
      socket.off("connect");
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users");
      socket.off("message_history");
      socket.off("user_typing");
      socket.off("user_stopped_typing");

      socket.disconnect();
    };
  }, []);

  const handleTyping = () => {
    socket.emit("typing", {
      username,
    });
  };

  const handleStopTyping = () => {
    socket.emit("stop_typing", {
      username,
    });
  };

  const handleSendMessage = (message: string) => {
    socket.emit("send_message", {
      username,
      message,
    });
  };

  return (
    <div>
      {!isJoined ? (
        <JoinChat onJoin={handleJoinChat} />
      ) : (
        <ChatLayout
          username={username}
          messages={messages}
          onlineUsers={onlineUsers}
          typingUser={typingUser}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

export default App;