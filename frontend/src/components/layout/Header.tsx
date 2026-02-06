import { useState, useEffect } from "react";
import {Menu, X, User, UsersRound, CalendarDays, House  } from "lucide-react";
import {SidebarButton} from "@/components/ui/SidebarButton.tsx";
import {useNavigate} from "react-router";

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("access");

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setOpen(false);
        window.location.href = "/login";
    };

    return (
        <>
            {/* HEADER */}
            <header className="bg-sky-950 fixed top-0 left-0 w-full z-50 border-b-2 border-logo-color/40">
                <div className="container flex items-center justify-between py-4">

                    {/* ΑΡΙΣΤΕΡΑ: Logo + Hamburger */}
                    <div className="flex items-center gap-3">

                        {/* Logo */}
                        <img
                            src="/logo_brain.png"
                            alt="ManagePsy logo"
                            className="h-10 w-auto"
                        />
                        <h1 className="text-logo-color font-bold text-xl">
                            ManagePsy
                        </h1>

                        {/* Hamburger (μόνο αν logged in) */}
                        {isLoggedIn && (
                            <button
                                onClick={() => setOpen(!open)}
                                className="ml-2 text-logo-color hover:text-amber-400 transition cursor-pointer"
                            >
                                {open ? <X /> : <Menu />}
                            </button>
                        )}

                    </div>

                    {/* ΔΕΞΙΑ: Logout */}
                    {isLoggedIn && (
                        <button
                            onClick={logout}
                            className="text-sm font-semibold text-logo-color
                           border border-logo-color px-3 py-1 rounded-md
                           hover:bg-logo-color hover:text-sky-950 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    )}

                </div>
            </header>


            {/* SIDEBAR ΚΑΤΩ ΑΠΟ HEADER */}
            {isLoggedIn && open && (
                <aside
                    className="fixed top-[64px] left-0 w-64 bg-sky-950 h-[calc(100vh-64px)]
                     shadow-xl z-40 border-r-2 rounded-r-2xl border-logo-color/40 p-4"
                >
                    <nav className="flex flex-col gap-5 py-4">
                        <SidebarButton onClick={()=> navigate('/home')} icon={House} label="Home Page" className="bg-sky-950 text-logo-color hover:bg-logo-color hover:text-sky-950" />
                        <SidebarButton onClick={()=> navigate('/my-profile')} icon={User} label="My Profile" className="bg-sky-950 text-logo-color hover:bg-logo-color hover:text-sky-950" />
                        <SidebarButton onClick={()=> navigate("/patients")} icon={UsersRound} label="Patients" className="bg-sky-950 text-logo-color hover:bg-logo-color" />
                        <SidebarButton onClick={() => navigate("/appointments")} icon={CalendarDays} label="Appointments" className="bg-sky-950 text-logo-color hover:bg-logo-color" />
                    </nav>
                </aside>
            )}

            {/* Overlay όταν είναι ανοιχτό (κάτω από το header) */}
            {isLoggedIn && open && (
                <div
                    className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black/40 z-30"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default Header;

