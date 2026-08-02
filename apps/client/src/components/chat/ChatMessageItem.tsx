import { type ChatMessage } from "../../types/message";

interface Props {
    message: ChatMessage;
}

const ChatMessageItem = ({ message }: Props) => {
    return (
        <div className="flex">

            <div className="max-w-lg rounded-2xl bg-white px-5 py-4 shadow-sm">

                <div className="mb-2 flex gap-4 items-center">

                    <h3 className="font-semibold text-slate-800">
                        {message.username}
                    </h3>

                    <span className="text-xs text-slate-400">
                        Just now
                    </span>

                </div>

                <p className="leading-relaxed text-slate-700">
                    {message.message}
                </p>

            </div>

        </div>
    );
};

export default ChatMessageItem;