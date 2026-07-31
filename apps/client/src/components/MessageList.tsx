import type { ChatMessage } from "../types/message";

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div>
            <h2>Messages</h2>
            {
                messages.length === 0 ? (
                    <p>No Messages Found</p>
                ) : (messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.username}</strong>: {message.message}
                    </div>
                )))
            }
        </div>
    )
}

export default MessageList