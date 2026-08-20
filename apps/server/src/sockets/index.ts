import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

import {
    createMessage,
    createSystemMessage,
    getMessages,
} from "../services/message.service.js";

interface JoinRoomPayload {
    room: string;
}

interface JoinChatPayload {
    username: string;
}

interface SendMessagePayload {
    username: string;
    message: string;
}

interface TypingPayload {
    username: string;
}

const connectedUsers = new Map<string, string>();
const connectedUserRooms = new Map<string, string>();

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ User Connected: ${socket.id}`);

        // -------------------------
        // Join Chat
        // -------------------------

        socket.on(
            "join_chat",
            (data: JoinChatPayload) => {
                connectedUsers.set(
                    socket.id,
                    data.username
                );

                console.log(
                    `${data.username} joined the chat`
                );

                io.emit(
                    "online_users",
                    [...connectedUsers.values()]
                );
            }
        );

        // -------------------------
        // Join Room
        // -------------------------

        socket.on(
            "join_room",
            async ({ room }: JoinRoomPayload) => {
                try {
                    const previousRoom =
                        connectedUserRooms.get(socket.id);

                    // Already in this room
                    if (previousRoom === room) {
                        return;
                    }

                    // Leave previous room
                    if (previousRoom) {
                        socket.leave(previousRoom);

                        console.log(
                            `${socket.id} left room: ${previousRoom}`
                        );
                    }

                    // Join new room
                    socket.join(room);

                    connectedUserRooms.set(
                        socket.id,
                        room
                    );

                    console.log(
                        `${socket.id} joined room: ${room}`
                    );

                    // Load room history
                    const messages =
                        await getMessages(room);

                    const formattedMessages =
                        messages.map((message) => ({
                            id: message.id,
                            type: message.type,
                            username: message.username,
                            message: message.message,
                            room: message.room,
                            timestamp:
                                message.timestamp.toISOString(),
                        }));

                    socket.emit(
                        "message_history",
                        formattedMessages
                    );

                    // Create join notification
                    const username =
                        connectedUsers.get(socket.id);

                    if (username) {
                        const systemMessage =
                            await createSystemMessage({
                                message: `${username} joined the chat`,
                                room,
                            });

                        io.to(room).emit(
                            "receive_message",
                            {
                                id: systemMessage.id,
                                type: systemMessage.type,
                                message:
                                    systemMessage.message,
                                room:
                                    systemMessage.room,
                                timestamp:
                                    systemMessage.timestamp.toISOString(),
                            }
                        );
                    }
                } catch (error) {
                    console.error(
                        "❌ Failed to join room:",
                        error
                    );
                }
            }
        );

        // -------------------------
        // Typing
        // -------------------------

        socket.on(
            "typing",
            (data: TypingPayload) => {
                const room =
                    connectedUserRooms.get(socket.id);

                if (!room) {
                    return;
                }

                socket.to(room).emit(
                    "user_typing",
                    {
                        username: data.username,
                    }
                );
            }
        );

        // -------------------------
        // Stop Typing
        // -------------------------

        socket.on(
            "stop_typing",
            (data: TypingPayload) => {
                const room =
                    connectedUserRooms.get(socket.id);

                if (!room) {
                    return;
                }

                socket.to(room).emit(
                    "user_stopped_typing",
                    {
                        username: data.username,
                    }
                );
            }
        );

        // -------------------------
        // Send Message
        // -------------------------

        socket.on(
            "send_message",
            async (data: SendMessagePayload) => {
                try {
                    const room =
                        connectedUserRooms.get(socket.id);

                    if (!room) {
                        console.error(
                            `❌ User ${socket.id} is not in a room`
                        );

                        return;
                    }

                    const message =
                        await createMessage({
                            username: data.username,
                            message: data.message,
                            room,
                        });

                    console.log(
                        "📩 Message Received:",
                        message
                    );

                    io.to(room).emit(
                        "receive_message",
                        {
                            id: message.id,
                            type: message.type,
                            username:
                                message.username,
                            message:
                                message.message,
                            room: message.room,
                            timestamp:
                                message.timestamp.toISOString(),
                        }
                    );
                } catch (error) {
                    console.error(
                        "❌ Failed to save message:",
                        error
                    );
                }
            }
        );

        // -------------------------
        // Disconnect
        // -------------------------

        socket.on(
            "disconnect",
            async () => {
                console.log(
                    `❌ User Disconnected: ${socket.id}`
                );

                const username =
                    connectedUsers.get(socket.id);

                const room =
                    connectedUserRooms.get(socket.id);

                connectedUsers.delete(socket.id);
                connectedUserRooms.delete(socket.id);

                // Persist leave notification
                if (username && room) {
                    try {
                        const systemMessage =
                            await createSystemMessage({
                                message: `${username} left the chat`,
                                room,
                            });

                        io.to(room).emit(
                            "receive_message",
                            {
                                id:
                                    systemMessage.id,
                                type:
                                    systemMessage.type,
                                message:
                                    systemMessage.message,
                                room:
                                    systemMessage.room,
                                timestamp:
                                    systemMessage.timestamp.toISOString(),
                            }
                        );
                    } catch (error) {
                        console.error(
                            "❌ Failed to save leave message:",
                            error
                        );
                    }
                }

                io.emit(
                    "online_users",
                    [...connectedUsers.values()]
                );
            }
        );
    });

    return io;
};