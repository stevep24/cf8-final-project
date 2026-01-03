
import Header from "./Header.tsx";

import Footer from "./Footer.tsx";
import {Outlet} from "react-router";


const Layout = () => {
    return (
        <>
            <Header />
            <div className="  w-full min-h-[92vh] bg-[url('/background.png')] bg-no-repeat bg-center bg-cover ">
                <Outlet/>
            </div>
            <Footer />

        </>
    )
}

export default Layout;