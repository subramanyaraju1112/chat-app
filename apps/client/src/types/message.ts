export interface ChatMessage {
  id: string;
  type: "message" | "system";
  username?: string;
  message: string;
  timestamp: string;
}