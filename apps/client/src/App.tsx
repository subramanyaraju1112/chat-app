import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import { login } from "./api/auth";
import type { ChatMessage } from "./types/message";
import JoinChat from "./components/auth/JoinChat";
import ChatLayout from "./components/chat/ChatLayout";

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] =
    useState<string | null>(null);

  const handleReceiveMessage = (
    data: ChatMessage
  ) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      data,
    ]);
  };

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    try {
      const data = await login({
        email,
        password,
      });

      setUsername(data.user.username);

      socket.connect();
    } catch (error) {
      console.error(
        "❌ Login failed:",
        error
      );
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(
        "✅ Connected:",
        socket.id
      );

      setIsJoined(true);
    });

    socket.on(
      "receive_message",
      handleReceiveMessage
    );

    socket.on(
      "online_users",
      (users: string[]) => {
        setOnlineUsers(users);
      }
    );

    socket.on(
      "message_history",
      (messages: ChatMessage[]) => {
        setMessages(messages);
      }
    );

    socket.on(
      "user_typing",
      ({ username }: { username: string }) => {
        setTypingUser(username);
      }
    );

    socket.on(
      "user_stopped_typing",
      ({ username }: { username: string }) => {
        setTypingUser((currentUser) =>
          currentUser === username
            ? null
            : currentUser
        );
      }
    );

    return () => {
      socket.off("connect");

      socket.off(
        "receive_message",
        handleReceiveMessage
      );

      socket.off("online_users");
      socket.off("message_history");
      socket.off("user_typing");
      socket.off(
        "user_stopped_typing"
      );

      socket.disconnect();
    };
  }, []);

  const handleRoomChange = (
    newRoom: string
  ) => {
    if (newRoom === room) return;

    setRoom(newRoom);
    setMessages([]);
    setTypingUser(null);

    socket.emit("join_room", {
      room: newRoom,
    });
  };

  const handleTyping = () => {
    socket.emit("typing", {
      username,
      room,
    });
  };

  const handleStopTyping = () => {
    socket.emit("stop_typing", {
      username,
      room,
    });
  };

  const handleSendMessage = (
    message: string
  ) => {
    socket.emit("send_message", {
      username,
      message,
      room,
    });
  };

  return (
    <div>
      {!isJoined ? (
        <JoinChat
          onLogin={handleLogin}
        />
      ) : (
        <ChatLayout
          username={username}
          room={room}
          messages={messages}
          onlineUsers={onlineUsers}
          typingUser={typingUser}
          onRoomChange={
            handleRoomChange
          }
          onTyping={handleTyping}
          onStopTyping={
            handleStopTyping
          }
          onSendMessage={
            handleSendMessage
          }
        />
      )}
    </div>
  );
}

export default App;