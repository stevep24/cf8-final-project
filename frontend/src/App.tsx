import {BrowserRouter,Routes,Route} from "react-router";
import './App.css'
import AuthRoute from "@/components/AuthRoute";
import Layout from "@/components/layout/Layout.tsx";
import FirstPage from "@/components/pages/FirstPage.tsx";
import LoginPage from "@/components/pages/LoginPage.tsx";
import SignupPage from "@/components/pages/SignupPage.tsx";
import HomePage from "@/components/pages/HomePage.tsx";
import PatientsPage from "@/components/pages/PatientsPage.tsx";
import AppointmentPage from "@/components/pages/AppointmentPage.tsx";
import MyProfilePage from "@/components/pages/MyProfilePage.tsx";



function App() {


  return (

      <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<FirstPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignupPage/>} />
                <Route path="/home" element={<AuthRoute><HomePage/></AuthRoute>}/>
                <Route path="/my-profile" element={<AuthRoute><MyProfilePage /></AuthRoute>}/>
                <Route path="/patients" element={<AuthRoute><PatientsPage/></AuthRoute>} />
                <Route path="/appointments" element={<AuthRoute><AppointmentPage/></AuthRoute>}/>
            </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App
