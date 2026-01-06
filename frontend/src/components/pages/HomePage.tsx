import { useEffect, useState } from "react";
import type {AuthUser} from "../../types.ts";

const HomePage = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            setError("Δεν είσαι συνδεδεμένος");
            return;
        }


        const fetchMe = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/auth/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Αποτυχία ταυτοποίησης");
                }

                const data = await response.json();
                setUser(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Κάτι πήγε στραβά");
                }
            }
        };

        fetchMe();
    }, []);

    return (
        <div className="p-10 text-white">
            {error && (
                <p className="text-red-400 text-lg font-semibold">
                    {error}
                </p>
            )}

            {user && (
                <div className="bg-sky-950 p-6 rounded-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome, {user.username}
                    </h2>
                    <p className="opacity-80">{user.email}</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
