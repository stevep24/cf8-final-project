import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormTextField} from "@/components/ui/FormTextField.tsx";
import {Label} from "@/components/ui/label.tsx";
import { useState } from "react";
import {useNavigate} from "react-router"
import * as React from "react";
import {PasswordChecklist} from "@/components/ui/PassCheckList"
const SignupPage = () => {

    const navigate = useNavigate();
    const [formData, settFormData] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        specialization: "",
        license_number: "",
        notes: ""
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [passwordFocused, setPasswordFocused] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        settFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:8000/api/auth/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data?.detail || "Αποτυχία εγγραφής"
                );
            }

            setSuccess("Ο λογαριασμός δημιουργήθηκε επιτυχώς!");
            setTimeout(() => navigate("/login"), 1500);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Κάτι πήγε στραβά");
            }
        }
    };

    return (
        <>
            <div className=" flex items-center justify-center min-h-[calc(100vh-64px)]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-sky-950 max-w-4xl w-150 mx-4 border rounded-md grid grid-cols-1 md:grid-cols-2 text-white"
                    autoComplete="off"
                >

                    <FormTextField
                        required id="first_name"
                        label="Όνομα"
                        type="text"
                        placeholder="Π.χ Στέφανος"
                        onChange={handleChange}
                    />

                    <FormTextField
                        required label="Επώνυμο"
                        type="text" id="last_name"
                        placeholder="Π.χ Παναγιωτόπουλος"
                        onChange={handleChange}/>

                    <FormTextField
                        label="Κινήτο"
                        required
                        pattern="^69\d{8}$"
                        type="text" id="phone_number"
                        placeholder="Π.χ 6971924363"
                        onChange={handleChange}/>

                    <FormTextField
                        label="Ειδικότητα"
                        required
                        type="text"
                        id="specialization"
                        placeholder="Π.χ Παιδοψυχολόγος"
                        onChange={handleChange}/>

                    <FormTextField
                        label="Αριθμός άδειας"
                        required
                        type="text"
                        id="license_number"
                        placeholder="Π.χ 1972-12301"
                        onChange={handleChange}/>

                    <div className="grid w-full m-3 p-4">
                        <Label className="text-logo-color mb-1"
                               htmlFor="message">
                            Σημειώσεις
                        </Label>
                        <Textarea placeholder="" id="notes" onChange={handleChange}/>
                    </div>

                    <FormTextField
                        required id="username"
                        label="Όνομα Χρήστη"
                        type="text"
                        placeholder="Π.χ stevep21"
                        onChange={handleChange}
                    />

                    <FormTextField
                        label="E-mail"
                        required
                        type="email"
                        id="email"
                        placeholder="Π.χ steve_pan@aueb.gr"
                        onChange={handleChange}/>

                    <FormTextField
                        label="Κωδικός Πρόσβασης"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                        required
                        type="password" id="password"
                        placeholder="Εισάγεται τον κωδικό σας"
                        onChange={handleChange}
                        onBlur={()=> setPasswordFocused(false)}
                        onFocus={()=> setPasswordFocused(true)}/>

                    {passwordFocused&& (<PasswordChecklist password={formData.password} />)}
                    <div className="md:col-span-2 flex justify-center mt-4  ">
                        <Button
                            className="text-xl h-12 w-30 bg-logo-color hover:bg-orange-400 text-sky-950 block mx-auto mb-3 "
                            type="submit"
                        >
                            Sign up
                        </Button>
                    </div>
                    {error && (
                        <p className="text-red-400 text-center md:col-span-2 mt-2">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-400 text-center md:col-span-2 mt-2">
                            {success}
                        </p>
                    )}
                </form>
            </div>
        </>
    )
}
export default SignupPage;