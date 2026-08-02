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
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-8 text-center text-3xl font-bold">Join Chat</h1>
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
        </div>
    )
}

export default JoinChat