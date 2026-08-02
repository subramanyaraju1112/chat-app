import { type ChatMessage } from "../types/message";

interface Props {
    message: ChatMessage;
}

const ChatMessageItem = ({ message }: Props) => {
    return (
        <div className="flex">

            <div className="max-w-md rounded-2xl bg-white p-4 shadow">

                <p className="mb-1 text-xs text-gray-500">

                    {message.username}

                </p>

                <p>

                    {message.message}

                </p>

            </div>

        </div>
    );
};

export default ChatMessageItem;