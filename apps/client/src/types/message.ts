export type ChatMessage =
  | {
    type: "message";
    id: string;
    username: string;
    message: string;
    timestamp: string;
  }
  | {
    type: "system";
    id: string;
    message: string;
    timestamp: string;
  };