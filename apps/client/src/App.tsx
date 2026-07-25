import { useEffect } from "react";
import { socket } from "./socket/socket";

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("connect");
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