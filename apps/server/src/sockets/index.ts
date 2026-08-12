import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { randomUUID } from "crypto";

interface JoinChatPayload {
    username: string;
}

const connectedUsers = new Map<string, string>();

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ User Connected: ${socket.id}`);

        socket.on("join_chat", (data: JoinChatPayload) => {
            connectedUsers.set(socket.id, data.username);
            console.log("Connected Users:");
            console.log(connectedUsers);
            io.emit("online_users", [...connectedUsers.values()]);
        });

        socket.on("typing", (data: { username: string }) => {
            socket.broadcast.emit("user_typing", {
                username: data.username,
            });
        });

        socket.on("stop_typing", (data: { username: string }) => {
            socket.broadcast.emit("user_stopped_typing", {
                username: data.username,
            });
        });

        socket.on("send_message", (data) => {
            const message = {
                id: randomUUID(),
                username: data.username,
                message: data.message,
                timestamp: new Date().toISOString(),
            };
            console.log("📩 Message Received:", message);
            io.emit("receive_message", message);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
            io.emit(
                "online_users",
                [...connectedUsers.values()]
            );
        });
    });

    return io;
};