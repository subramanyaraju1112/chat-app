import { useState, type ChangeEvent } from "react";

interface JoinChatProps {
    onLogin: (
        email: string,
        password: string
    ) => void;
}

const JoinChat = ({ onLogin }: JoinChatProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            return;
        }

        onLogin(trimmedEmail, password);

        setEmail("");
        setPassword("");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
                {/* Header */}
                <h1 className="text-center text-3xl font-bold text-slate-800">
                    Socket.IO Chat
                </h1>

                <p className="mt-2 mb-8 text-center text-sm text-slate-500">
                    Login to start chatting.
                </p>

                {/* Form */}
                <div className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinChat;