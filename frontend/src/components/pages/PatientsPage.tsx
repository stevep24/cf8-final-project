import { useEffect, useState } from "react";
import { BookUser, Trash2, UserRoundPen } from "lucide-react";
import type { Patient } from "@/types.ts";

const PatientsPage = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [error, setError] = useState("");

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Patient>>({});

    const token = localStorage.getItem("access");

    // -------------------------
    // FETCH
    // -------------------------
    useEffect(() => {
        if (!token) {
            setError("Δεν είσαι συνδεδεμένος");
            return;
        }

        fetch("http://localhost:8000/api/patients/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error("Σφάλμα φόρτωσης");
                return res.json();
            })
            .then(setPatients)
            .catch(err => setError(err.message));
    }, []);

    // -------------------------
    // DELETE
    // -------------------------
    const deletePatient = async (id: number) => {
        if (!confirm("Σίγουρα θέλεις να διαγράψεις τον ασθενή;")) return;

        await fetch(`http://localhost:8000/api/patients/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(prev => prev.filter(p => p.id !== id));
        setExpandedId(null);
    };

    // -------------------------
    // EDIT
    // -------------------------
    const startEdit = (p: Patient) => {
        setEditId(p.id);
        setEditForm({ ...p });
    };

    const saveEdit = async (id: number) => {
        const response = await fetch(
            `http://localhost:8000/api/patients/${id}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            }
        );

        if (!response.ok) {
            alert("Σφάλμα ενημέρωσης");
            return;
        }

        const updated = await response.json();
        setPatients(prev => prev.map(p => (p.id === id ? updated : p)));
        setEditId(null);
        setEditForm({});
    };

    // -------------------------
    // RENDER
    // -------------------------
    return (
        <div className="p-10 text-white max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Ασθενείς</h1>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="bg-sky-950 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-sky-900">
                    <tr>
                        <th className="p-3 text-left">Όνομα</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Κατάσταση</th>
                        <th className="p-3 text-center">Ενέργειες</th>
                    </tr>
                    </thead>

                    <tbody>
                    {patients.map(p => (
                        <>
                            {/* BASIC */}
                            <tr key={p.id} className="border-t border-white/10">
                                <td className="p-3">
                                    {p.first_name} {p.last_name}
                                </td>
                                <td className="p-3">{p.email}</td>
                                <td className="p-3">{p.status}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() =>
                                            setExpandedId(expandedId === p.id ? null : p.id)
                                        }
                                        className="mx-auto flex items-center gap-1 text-logo-color hover:opacity-70"
                                    >
                                        <BookUser size={18} />
                                        More details
                                    </button>
                                </td>
                            </tr>

                            {/* DETAILS */}
                            {expandedId === p.id && (
                                <tr className="bg-sky-900/50">
                                    <td colSpan={3} className="p-4">
                                        {editId !== p.id ? (
                                            <div className="space-y-2">
                                                <p><b>Όνομα:</b> {p.first_name}</p>
                                                <p><b>Επώνυμο:</b> {p.last_name}</p>
                                                <p><b>Διαταραχή:</b> {p.mental_disorder || "-"}</p>
                                                <p><b>Ημ. Γέννησης:</b> {p.birth_date || "-"}</p>
                                                <p><b>Τηλέφωνο:</b> {p.phone_number}</p>
                                                <p><b>Email:</b> {p.email}</p>
                                                <p><b>Επικοινωνία ανάγκης:</b> {p.emergency_contact_name}</p>
                                                <p><b>Τηλέφωνο ανάγκης:</b> {p.emergency_contact_phone}</p>
                                                <p><b>Κατάσταση:</b> {p.status}</p>
                                                <p><b>Πρώτη συνεδρία:</b> {p.first_session_date || "-"}</p>

                                                <div>
                                                    <b>Σημειώσεις:</b>
                                                    <div className="mt-1 whitespace-pre-wrap break-words bg-sky-950 p-2 rounded">
                                                        {p.notes || "-"}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 mt-4">
                                                    <button
                                                        onClick={() => startEdit(p)}
                                                        className="flex items-center gap-1 bg-logo-color text-sky-950 px-3 py-1 rounded"
                                                    >
                                                        <UserRoundPen size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deletePatient(p.id)}
                                                        className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    ["first_name", "Όνομα"],
                                                    ["last_name", "Επώνυμο"],
                                                    ["mental_disorder", "Διαταραχή"],
                                                    ["phone_number", "Τηλέφωνο"],
                                                    ["email", "Email"],
                                                    ["emergency_contact_name", "Επικοινωνία ανάγκης"],
                                                    ["emergency_contact_phone", "Τηλέφωνο ανάγκης"],
                                                ].map(([key, label]) => (
                                                    <input
                                                        key={key}
                                                        className="p-2 rounded text-black"
                                                        placeholder={label}
                                                        value={(editForm as any)[key] || ""}
                                                        onChange={e =>
                                                            setEditForm({
                                                                ...editForm,
                                                                [key]: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ))}

                                                <input
                                                    type="date"
                                                    className="p-2 rounded text-black"
                                                    value={editForm.birth_date || ""}
                                                    onChange={e =>
                                                        setEditForm({
                                                            ...editForm,
                                                            birth_date: e.target.value,
                                                        })
                                                    }
                                                />

                                                <input
                                                    type="date"
                                                    className="p-2 rounded text-black"
                                                    value={editForm.first_session_date || ""}
                                                    onChange={e =>
                                                        setEditForm({
                                                            ...editForm,
                                                            first_session_date: e.target.value,
                                                        })
                                                    }
                                                />

                                                <select
                                                    className="p-2 rounded text-black"
                                                    value={editForm.status || "ACTIVE"}
                                                    onChange={e =>
                                                        setEditForm({
                                                            ...editForm,
                                                            status: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="ACTIVE">Ενεργός</option>
                                                    <option value="INACTIVE">Ανενεργός</option>
                                                </select>

                                                <div className="md:col-span-2">
                            <textarea
                                rows={6}
                                className="w-full p-2 rounded text-black resize-none"
                                value={editForm.notes || ""}
                                onChange={e =>
                                    setEditForm({
                                        ...editForm,
                                        notes: e.target.value,
                                    })
                                }
                            />
                                                </div>

                                                <div className="md:col-span-2 flex gap-4">
                                                    <button
                                                        onClick={() => saveEdit(p.id)}
                                                        className="bg-logo-color text-sky-950 px-4 py-2 rounded"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditId(null)}
                                                        className="border px-4 py-2 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientsPage;
