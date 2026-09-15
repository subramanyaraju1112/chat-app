import { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

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

        console.log("Authenticated user:", payload);

        next();
    } catch (error) {
        console.error(
            "Socket authentication failed:",
            error
        );

        next(new Error("Invalid or expired token"));
    }
};