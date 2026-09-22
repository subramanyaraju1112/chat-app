interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export const login = async ({
    email,
    password,
}: LoginInput): Promise<LoginResponse> => {
    const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
};