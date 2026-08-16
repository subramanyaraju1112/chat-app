import { randomUUID } from "crypto";
import { Message } from "../models/message.js";

interface CreateMessageInput {
    username: string;
    message: string;
}

export const createMessage = async ({
    username,
    message,
}: CreateMessageInput) => {
    const newMessage = await Message.create({
        id: randomUUID(),
        type: "message",
        username,
        message,
        timestamp: new Date(),
    });

    return newMessage;
};

export const getMessages = async () => {
    return Message.find()
        .sort({ timestamp: 1 })
        .limit(50)
        .lean();
};