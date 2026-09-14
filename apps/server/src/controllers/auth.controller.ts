import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";
import { User } from "../models/user.js";

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

        const user = await User.findById(
            req.user.userId
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error(
            "Failed to get current user:",
            error
        );

        return res.status(500).json({
            message: "Failed to get current user",
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
        const result = await loginUser({
            email: req.body.email,
            password: req.body.password,
        });

        res.cookie(
            "accessToken",
            result.accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            }
        );

        return res.status(200).json({
            message: "Login successful",
            user: result.user,
        });
    } catch (error) {
        return res.status(401).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Login failed",
        });
    }
};