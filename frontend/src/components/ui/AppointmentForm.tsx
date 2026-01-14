import { useEffect, useState } from "react";

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
}

const AppointmentForm = ({ onCreated }: { onCreated: () => void }) => {
    const token = localStorage.getItem("access");

    const [patients, setPatients] = useState<Patient[]>([]);
    const [form, setForm] = useState({
        patient_id: "",
        session_datetime: "",
        duration_minutes: 60,
        session_type: "",
        price:"",
    });

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch("http://localhost:8000/api/patients/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setPatients(data);
        };
        fetchPatients();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("http://localhost:8000/api/appointments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                patient_id: form.patient_id,
                session_datetime: form.session_datetime,
                duration_minutes: form.duration_minutes,
                session_type: form.session_type,
                price: form.price,

            }),
        });

        onCreated();
    };

    return (
        <form
            onSubmit={submit}
            className="bg-sky-950 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <select
                required
                className="text-black p-2 rounded"
                value={form.patient_id}
                onChange={(e) =>
                    setForm({ ...form, patient_id: e.target.value })
                }
            >
                <option value="">Επιλογή Ασθενή</option>
                {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                    </option>
                ))}
            </select>

            <input
                type="datetime-local"
                required
                className="text-black p-2 rounded"
                value={form.session_datetime}
                onChange={(e) =>
                    setForm({ ...form, session_datetime: e.target.value })
                }
            />

            <input
                type="number"
                min={15}
                className="text-black p-2 rounded"
                value={form.duration_minutes}
                onChange={(e) =>
                    setForm({
                        ...form,
                        duration_minutes: Number(e.target.value),
                    })
                }
            />

            <select
                className="text-black p-2 rounded"
                value={form.session_type}
                onChange={(e) =>
                    setForm({ ...form, session_type: e.target.value })
                }
            >
                <option value="IN_PERSON">Δια ζώσης</option>
                <option value="ONLINE">Online</option>
            </select>

            <input
                type="number"
                min={0}
                step="0.01"
                required
                className="text-black p-2 rounded"
                placeholder="Τιμή (€)"
                value={form.price}
                onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                }
            />

            <button className="md:col-span-3 bg-logo-color text-sky-950 py-2 rounded">
                Προσθήκη Ραντεβού
            </button>
        </form>
    );
};

export default AppointmentForm;
