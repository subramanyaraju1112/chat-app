import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import { socket } from "./socket/socket";

function App() {

  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      console.log("📩 Received:", data);
      setReceivedMessage(data.message);
    });

    return () => {
      socket.off("connect");
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
      <h1>{receivedMessage}</h1>
    </div>
  );
}

export default App;