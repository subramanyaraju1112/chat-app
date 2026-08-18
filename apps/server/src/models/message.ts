import { Schema, model, type Document } from "mongoose";

export interface IMessage extends Document {
    id: string;
    type: "message" | "system";
    username?: string;
    message: string;
    room: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },

        type: {
            type: String,
            enum: ["message", "system"],
            required: true,
        },

        username: {
            type: String,
            required: false,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        room: {
            type: String,
            required: true,
            trim: true,
        },

        timestamp: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export const Message = model<IMessage>(
    "Message",
    messageSchema
);