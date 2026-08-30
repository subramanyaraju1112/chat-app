import bcrypt from "bcrypt";
import { User } from "../models/user.js";

interface RegisterUserInput {
    username: string;
    email: string;
    password: string;
}

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