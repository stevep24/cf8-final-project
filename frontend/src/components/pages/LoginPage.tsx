import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import { useNavigate } from "react-router";



const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("SUBMIT FIRED");
        console.log(username, password);
        setError("");
        try {
            const response = await fetch("http://localhost:8000/api/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            if (!response.ok) {
                throw new Error("Λαθός username ή password")
            }
            const data = await response.json();
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            navigate("/home");
        }catch( error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }else {
                setError("κατι πηγε λαθος, ξανα προσπαθησε")
            }

        }
    }
    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-sky-950 max-w-sm w-full mx-4 border rounded-md"
                    autoComplete="off"
                >
                    <div className="m-3 p-4">
                        <Label className="text-logo-color mb-1" htmlFor="username">Username</Label>
                        <Input required type="text"
                               id="username"
                               placeholder="π.χ stevep21"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)} />

                    </div>
                    <div className="m-3 p-4">
                        <Label className="text-logo-color mb-1 " htmlFor="password">Password</Label>
                        <Input required
                               type="password"
                               id="password"
                               placeholder="Εισάγεται τον κωδικό σας"
                               onChange={(e) => setPassword(e.target.value)}
                               value={password}/>

                    </div>

                    {error && (
                        <p className="text-red-400 text-center font-medium mt-2">
                            {error}
                        </p>
                    )}

                    <div>
                        <Button
                            className=" bg-logo-color hover:opacity-70 cursor-pointer text-sky-950 block mx-auto mb-3 "
                            type="submit"
                        >
                            Log in
                        </Button>
                    </div>

                </form>
            </div>
        </>
    )
}
export default LoginPage;