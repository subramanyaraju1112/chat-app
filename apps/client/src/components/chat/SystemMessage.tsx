import type { ChatMessage } from "../../types/message";

interface SystemMessageProps {
    message: Extract<ChatMessage, { type: "system" }>;
}

const SystemMessage = ({ message }: SystemMessageProps) => {
    return (
        <div className="flex justify-center">
            <p className="rounded-full bg-slate-200 px-4 py-1.5 text-xs text-slate-500">
                {message.message}
            </p>
        </div>
    );
};

export default SystemMessage;