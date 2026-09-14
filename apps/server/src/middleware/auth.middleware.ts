import type {
    Request,
    Response,
    NextFunction,
} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    username: string;
}

export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                message:
                    "Authentication token is required",
            });
        }

        const jwtSecret =
            process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error(
                "JWT_SECRET is not defined"
            );
        }

        const decoded = jwt.verify(
            token,
            jwtSecret
        ) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message:
                "Invalid or expired access token",
        });
    }
};