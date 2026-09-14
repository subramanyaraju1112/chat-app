import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";

export const getCurrentUser = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get user",
        });
    }
};

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
            message:
                "User registered successfully",
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

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const result = await loginUser({
            email,
            password,
        });

        return res.status(200).json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        console.error(
            "❌ Login failed:",
            error
        );

        return res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Invalid email or password",
        });
    }
};