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

        socket.on("join_chat", (data) => {
            console.log(`${data.username} joined the chat`);
        });

        socket.on("send_message", (data) => {
            console.log("📩 Message Received:", data);
            io.emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);
        });
    });

    return io;
};