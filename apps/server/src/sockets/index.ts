import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ User Connected: ${socket.id}`);

        socket.on("send_message", (data) => {
            console.log("📩 Message Received:", data);
            io.emit("recieve_message", data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);
        });
    });

    return io;
};