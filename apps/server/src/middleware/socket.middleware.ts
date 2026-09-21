import { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthenticatedSocket extends Socket {
    user: {
        userId: string;
        username: string;
    };
}

const getAccessTokenFromCookie = (
    cookieHeader?: string
) => {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim());

    const accessTokenCookie = cookies.find(
        (cookie) =>
            cookie.startsWith("accessToken=")
    );

    if (!accessTokenCookie) {
        return null;
    }

    return accessTokenCookie.split("=")[1];
};

export const authenticateSocket = (
    socket: Socket,
    next: (err?: Error) => void
) => {
    try {
        const cookieHeader =
            socket.handshake.headers.cookie;

        const token =
            getAccessTokenFromCookie(cookieHeader);

        if (!token) {
            return next(
                new Error("Authentication required")
            );
        }

        const payload =
            verifyAccessToken(token);

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