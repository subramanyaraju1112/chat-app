import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { randomUUID } from "crypto";
import { createMessage } from "../services/message.service.js";

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

            io.emit(
                "online_users",
                [...connectedUsers.values()]
            );

            const systemMessage = {
                id: randomUUID(),
                type: "system",
                message: `${data.username} joined the chat`,
                timestamp: new Date().toISOString(),
            };

            io.emit("receive_message", systemMessage);
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

        socket.on("send_message", async (data) => {
            try {
                const message = await createMessage({
                    username: data.username,
                    message: data.message,
                });

                console.log("📩 Message Received:", message);

                io.emit("receive_message", {
                    id: message.id,
                    type: message.type,
                    username: message.username,
                    message: message.message,
                    timestamp: message.timestamp.toISOString(),
                });
            } catch (error) {
                console.error("❌ Failed to save message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);

            const username = connectedUsers.get(socket.id);

            connectedUsers.delete(socket.id);

            if (username) {
                const systemMessage = {
                    id: randomUUID(),
                    type: "system",
                    message: `${username} left the chat`,
                    timestamp: new Date().toISOString(),
                };

                io.emit("receive_message", systemMessage);
            }

            io.emit(
                "online_users",
                [...connectedUsers.values()]
            );
        });
    });

    return io;
};