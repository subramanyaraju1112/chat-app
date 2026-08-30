import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

interface RegisterUserInput {
    username: string;
    email: string;
    password: string;
}

interface LoginUserInput {
    email: string;
    password: string;
}

// Register User

export const registerUser = async ({
    username,
    email,
    password,
}: RegisterUserInput) => {
    const existingUser = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if (existingUser) {
        throw new Error(
            "Username or email already exists"
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        10
    );

    const user = await User.create({
        username,
        email,
        password: passwordHash,
    });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
    };
};

// Login User

export const loginUser = async ({
    email,
    password,
}: LoginUserInput) => {
    const user = await User.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error(
            "JWT_SECRET is not defined"
        );
    }

    const accessToken = jwt.sign(
        {
            userId: user._id.toString(),
            username: user.username,
        },
        jwtSecret,
        {
            expiresIn: "15m",
        }
    );

    return {
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    };
};