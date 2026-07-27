import { useEffect } from "react";
import { socket } from "./socket/socket";

function App() {
  useEffect(() => {

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("send_message", {
        username: "Subramanya",
        message: "Hello Socket.IO 👋",
      });
    });

    socket.on("receive_message", (data) => {
      console.log("📩 Received:", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO Chat Application</h1>
    </div>
  );
}

export default App;