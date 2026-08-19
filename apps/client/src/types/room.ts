export interface ChatRoom {
    id: string;
    name: string;
}

export const CHAT_ROOMS: ChatRoom[] = [
    {
        id: "general",
        name: "General",
    },
    {
        id: "technology",
        name: "Technology",
    },
    {
        id: "gaming",
        name: "Gaming",
    },
];