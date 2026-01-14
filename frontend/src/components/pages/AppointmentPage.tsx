import { useEffect, useState } from "react";
import type { Appointment } from "@/types";
import AppointmentForm from "../ui/AppointmentForm.tsx";
import {Calendar,Clock,Bookmark,Euro,NotebookTabs } from 'lucide-react';

const AppointmentPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showForm, setShowForm] = useState(false);
    const token = localStorage.getItem("access");
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [patients, setPatients] = useState<any[]>([]);
    const [notes, setNotes] = useState<Record<number, string>>({});


    const filteredAppointments = appointments.filter((app) => {
        if (!selectedDate) return true;

        const appDate = new Date(app.session_datetime)
            .toISOString()
            .slice(0, 10);

        return appDate === selectedDate;
    });



    const fetchAppointments = async (patientId?: number) => {
        const token = localStorage.getItem("access");

        const url = patientId
            ? `http://localhost:8000/api/appointments/by-patient/${patientId}/`
            : `http://localhost:8000/api/appointments/`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setAppointments(data);
    };


    useEffect(() => {
        fetchAppointments();

        const fetchPatients = async () => {
            const res = await fetch("http://localhost:8000/api/patients/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(await res.json());
        };

        fetchPatients();
    }, []);

    const completeAppointment = async (id: number) => {
        await fetch(
            `http://localhost:8000/api/appointments/${id}/complete/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        await fetchAppointments();
    };

    const cancelAppointment = async (id: number) => {
        await fetch(
            `http://localhost:8000/api/appointments/${id}/cancel/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        await fetchAppointments();
    };

    return (
        <div className="p-10 text-white">
            {/* ΤΙΤΛΟΣ */}
            <h1 className="text-2xl font-bold mb-6">Ραντεβού</h1>

            {/* ΚΟΥΜΠΙ ΝΕΟΥ ΡΑΝΤΕΒΟΥ */}
            <button
                onClick={() => setShowForm((prev) => !prev)}
                className="mb-6 bg-logo-color text-sky-950 px-4 py-2 rounded"
            >
                + Νέο Ραντεβού
            </button>

            {/* FORM ΔΗΜΙΟΥΡΓΙΑΣ */}
            {showForm && (
                <AppointmentForm
                    onCreated={() => {
                        fetchAppointments();
                        setShowForm(false);
                    }}
                />
            )}

            {/* ΦΙΛΤΡΑ */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* ΦΙΛΤΡΟ ΑΣΘΕΝΗ */}
                <select
                    className="text-black bg-logo-color p-2 rounded"
                    value={selectedPatient ?? ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (!value) {
                            setSelectedPatient(null);
                            fetchAppointments();
                        } else {
                            const id = Number(value);
                            setSelectedPatient(id);
                            fetchAppointments(id);
                        }
                    }}
                >
                    <option value="">Όλοι οι ασθενείς</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.first_name} {p.last_name}
                        </option>
                    ))}
                </select>

                {/* ΦΙΛΤΡΟ ΗΜΕΡΑΣ */}
                <input
                    type="date"
                    className="text-black bg-logo-color p-2 rounded"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />

                {/* CLEAR */}
                <button
                    onClick={() => {
                        setSelectedPatient(null);
                        setSelectedDate("");
                        fetchAppointments();
                    }}
                    className="bg-gray-500 px-4 py-2 rounded"
                >
                    Clear
                </button>
            </div>

            {/* ΛΙΣΤΑ ΡΑΝΤΕΒΟΥ */}
            <div className="mt-8 space-y-4">
                {filteredAppointments.length === 0 && (
                    <p className="opacity-70">Δεν υπάρχουν ραντεβού</p>
                )}

                {filteredAppointments.map((app) => (
                    <div
                        key={app.id}
                        className="bg-sky-950 p-4 rounded-lg space-y-1"
                    >
                        <p className="font-semibold">
                            {app.patient.first_name} {app.patient.last_name}
                        </p>

                        <div className="flex">
                            <Calendar className= "size-4" />
                            <p className=" pl-2 text-sm">
                                 {new Date(app.session_datetime).toLocaleString()}
                            </p>
                        </div>

                        <div className="flex">
                            <Clock className="size-4"/>
                            <p className="pl-2 text-sm"> {app.duration_minutes} λεπτά</p>
                        </div>


                        <p className="text-sm">
                            Τύπος:{" "}
                            {app.session_type === "IN_PERSON"
                                ? "Δια ζώσης"
                                : "Διαδικτυακά"}
                        </p>

                        <div className="flex">
                            <Euro className="size-4"/>
                            <p className ="pl-2 text-sm"> Τιμή: {app.price} </p>
                        </div>


                        <div className="flex">
                            <Bookmark className="size-4"/>
                            <p className="pl-2 text-sm">Κατάσταση: {app.status}</p>
                        </div>


                        {app.notes_from_therapist && (
                            <p className="text-sm italic opacity-80">
                                {app.notes_from_therapist}
                            </p>
                        )}

                        {app.status === "SCHEDULED" && (
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => completeAppointment(app.id)}
                                    className="bg-green-500 px-3 py-1 rounded"
                                >
                                    Complete
                                </button>
                                <button
                                    onClick={() => cancelAppointment(app.id)}
                                    className="bg-red-500 px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {app.status === "COMPLETED" && (
                            <div className="mt-3">
                                <NotebookTabs className="size-4" />
                                <label className="text-sm opacity-80">
                                     Σημειώσεις θεραπευτή
                                </label>

                                <textarea
                                    className="w-full mt-1 p-2 text-white rounded"
                                    placeholder="Γράψε σημειώσεις για τη συνεδρία..."
                                    value={notes[app.id] ?? app.notes_from_therapist ?? ""}
                                    onChange={(e) =>
                                        setNotes({
                                            ...notes,
                                            [app.id]: e.target.value,
                                        })
                                    }
                                />

                                <button
                                    className="mt-2 bg-logo-color text-sky-950 px-3 py-1 rounded"
                                    onClick={async () => {
                                        const value = notes[app.id]?.trim();
                                        if (!value) return;
                                        await fetch(
                                            `http://localhost:8000/api/appointments/${app.id}/`,
                                            {
                                                method: "PATCH",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                                                },
                                                body: JSON.stringify({
                                                    notes_from_therapist: value,
                                                }),
                                            }
                                        );
                                        await fetchAppointments();
                                    }}
                                >
                                    Αποθήκευση σημειώσεων
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentPage;
