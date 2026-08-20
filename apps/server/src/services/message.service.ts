import { randomUUID } from "crypto";
import { Message } from "../models/message.js";

interface CreateMessageInput {
    username: string;
    message: string;
    room: string;
}

interface CreateSystemMessageInput {
    message: string;
    room: string;
}

export const createMessage = async ({
    username,
    message,
    room,
}: CreateMessageInput) => {
    const newMessage = await Message.create({
        id: randomUUID(),
        type: "message",
        username,
        message,
        room,
        timestamp: new Date(),
    });

    return newMessage;
};

export const createSystemMessage = async ({
    message,
    room,
}: CreateSystemMessageInput) => {
    const newMessage = await Message.create({
        id: randomUUID(),
        type: "system",
        message,
        room,
        timestamp: new Date(),
    });

    return newMessage;
};

export const getMessages = async (room: string) => {
    return Message.find({ room })
        .sort({ timestamp: 1 })
        .limit(50)
        .lean();
};