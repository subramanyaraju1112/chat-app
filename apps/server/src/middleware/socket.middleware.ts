import { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthenticatedSocket extends Socket {
    user: {
        userId: string;
        username: string;
    };
}

export const authenticateSocket = (
    socket: Socket,
    next: (err?: Error) => void
) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(
                new Error("Authentication required")
            );
        }

        const payload = verifyAccessToken(token);

        const authenticatedSocket =
            socket as AuthenticatedSocket;

        authenticatedSocket.user = {
            userId: payload.userId,
            username: payload.username,
        };

        console.log(
            `🔐 Socket authenticated: ${payload.username}`
        );

        next();
    } catch (error) {
        console.error(
            "❌ Socket authentication failed:",
            error
        );

        next(
            new Error(
                "Invalid or expired token"
            )
        );
    }
};