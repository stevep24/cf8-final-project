import { useEffect, useState } from "react";
import { Users, CalendarDays, Plus } from "lucide-react";
import { useNavigate } from "react-router";

type User = {
    username: string;
    email: string;
};

const HomePage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [patientsCount, setPatientsCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) return;

        fetch("http://localhost:8000/api/auth/me/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setUser);

        fetch("http://localhost:8000/api/patients/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setPatientsCount(data.length));

        fetch("http://localhost:8000/api/appointments/upcoming/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setUpcomingCount(data.length));
    }, []);
    return (
        <div className="min-h-[92vh]   p-10 text-white max-w-6xl mx-auto">

            {/* Welcome */}
            <h1 className="text-3xl font-bold mb-8">
                Καλώς ήρθες{user && `, ${user.username}`}
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div className="bg-sky-950 p-6 rounded-lg flex items-center gap-4">
                    <Users className="text-logo-color w-8 h-8" />
                    <div>
                        <p className="text-sm opacity-80">Σύνολο ασθενών</p>
                        <p className="text-2xl font-bold">{patientsCount}</p>
                    </div>
                </div>

                <div className="bg-sky-950 p-6 rounded-lg flex items-center gap-4">
                    <CalendarDays className="text-logo-color w-8 h-8" />
                    <div>
                        <p className="text-sm opacity-80">Επερχόμενα ραντεβού</p>
                        <p className="text-2xl font-bold">{upcomingCount}</p>
                    </div>
                </div>

                <div className="bg-sky-950 p-6 rounded-lg flex items-center gap-4">
                    <Plus className="text-logo-color w-8 h-8" />
                    <div className="">
                        <p className="text-sm opacity-80">Γρήγορη ενέργεια</p>
                        <button
                            onClick={() => navigate("/appointments")}
                            className="text-logo-color underline cursor-pointer"
                        >
                            Νέο ραντεβού
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-logo-color underline pl-2 cursor-pointer"
                        >
                            Νέος Ασθενης
                        </button>
                    </div>
                </div>

            </div>

            {/* Quick actions */}
            <div className="bg-sky-950 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Γρήγορες κινήσεις</h2>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate("/patients")}
                        className="bg-logo-color text-sky-950 px-4 py-2 rounded hover:bg-amber-400 cursor-pointer"
                    >
                        Λίστα ασθενών
                    </button>

                    <button
                        onClick={() => navigate("/appointments")}
                        className="bg-logo-color text-sky-950 px-4 py-2 rounded hover:bg-amber-400 cursor-pointer"
                    >
                        Ραντεβού
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
