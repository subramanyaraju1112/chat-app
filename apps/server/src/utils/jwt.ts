import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
    userId: string;
    username: string;
}

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return secret;
};

export const generateAccessToken = (
    payload: JwtPayload
) => {
    const expiresIn =
        process.env.JWT_EXPIRES_IN || "15m";

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: expiresIn as SignOptions["expiresIn"],
    });
};

export const verifyAccessToken = (
    token: string
) => {
    return jwt.verify(
        token,
        getJwtSecret()
    ) as JwtPayload;
};