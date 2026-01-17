import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormTextField } from "@/components/ui/FormTextField";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    onClose: () => void;
    onCreated: () => void;
};

const CreatePatientModal = ({ onClose, onCreated }: Props) => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        mental_disorder: "",
        birth_date: "",
        phone_number: "",
        email: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        status: "ACTIVE",
        first_session_date: "",
        notes: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        console.log("CHANGE:", e.target.tagName, e.target.name);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("access");

        const res = await fetch("http://localhost:8000/api/patients/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(form),
        });

        if (!res.ok) {
            alert("Σφάλμα δημιουργίας ασθενή");
            return;
        }

        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-sky-950 text-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Νέος Ασθενής</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormTextField name="first_name" label="Όνομα" onChange={handleChange} />
                    <FormTextField name="last_name" label="Επώνυμο" onChange={handleChange} />
                    <FormTextField name="phone_number" label="Τηλέφωνο" onChange={handleChange} />
                    <FormTextField name="email" label="Email" type="email" onChange={handleChange} />
                    <FormTextField name="birth_date" label="Ημ. Γέννησης" type="date" onChange={handleChange} />
                    <FormTextField name="first_session_date" label="1η Συνεδρία" type="date" onChange={handleChange} />
                    <FormTextField name="mental_disorder" label="Διάγνωση" onChange={handleChange} />
                    <FormTextField
                        name="emergency_contact_name"
                        label="Επείγουσα Επαφή (Όνομα)"
                        onChange={handleChange}
                    />
                    <FormTextField
                        name="emergency_contact_phone"
                        label="Επείγουσα Επαφή (Τηλέφωνο)"
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <Textarea
                        name="notes"
                        placeholder="Σημειώσεις"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button className="hover:opacity-70 cursor-pointer" variant="ghost" onClick={onClose}>
                        Ακύρωση
                    </Button>
                    <Button onClick={handleSubmit} className="bg-logo-color hover:opacity-70 cursor-pointer text-sky-950">
                        Αποθήκευση
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePatientModal;
