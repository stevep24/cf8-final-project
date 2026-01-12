
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router";


const Layout = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col">
                {/* CONTENT */}
                <div className="flex-1 w-full pt-[64px] bg-[url('/background.png')] bg-no-repeat bg-center bg-cover">
                    <Outlet />
                </div>
                <Footer />
            </div>

        </>
    )
}

export default Layout;