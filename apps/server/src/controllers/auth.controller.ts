import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message:
                    "Username, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters",
            });
        }

        const user = await registerUser({
            username,
            email,
            password,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error(
            "❌ Registration failed:",
            error
        );

        return res.status(409).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Registration failed",
        });
    }
};