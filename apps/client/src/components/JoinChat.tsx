import { useState, type ChangeEvent } from "react";

interface JoinChatProps {
    onJoin: (username: string) => void;
}

const JoinChat = ({ onJoin }: JoinChatProps) => {

    const [username, setUsername] = useState("");

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleJoinChat = () => {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) return;

        onJoin(trimmedUsername);

        setUsername("");
    };

    return (
        <div>
            <h1>Join Chat</h1>

            <input
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={handleOnChange}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleJoinChat();
                    }
                }}
            />

            <button onClick={handleJoinChat}>
                Join Chat
            </button>
        </div>
    )
}

export default JoinChat