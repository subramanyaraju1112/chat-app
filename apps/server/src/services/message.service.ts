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