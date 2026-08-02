import { useState, type ChangeEvent } from "react";

interface JoinChatProps {
    onJoin: (username: string) => void;
}

const JoinChat = ({ onJoin }: JoinChatProps) => {
    const [username, setUsername] = useState("");

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleJoinChat = () => {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) return;

        onJoin(trimmedUsername);

        setUsername("");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">

                {/* Header */}
                <h1 className="text-center text-3xl font-bold text-slate-800">
                    Socket.IO Chat
                </h1>

                <p className="mt-2 mb-8 text-center text-sm text-slate-500">
                    Enter your username to start chatting.
                </p>

                {/* Form */}
                <div className="space-y-5">

                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="e.g. Subramanya"
                            value={username}
                            onChange={handleOnChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleJoinChat();
                                }
                            }}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleJoinChat}
                        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Join Chat
                    </button>

                </div>
            </div>
        </div>
    );
};

export default JoinChat;