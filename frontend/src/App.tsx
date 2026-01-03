import {BrowserRouter,Routes,Route} from "react-router";
import './App.css'
import Layout from "@/components/layout/Layout.tsx";
import FirstPage from "@/components/pages/FirstPage.tsx";
import LoginPage from "@/components/pages/LoginPage.tsx";
import SignupPage from "@/components/pages/SignupPage.tsx";
import HomePage from "@/components/pages/HomePage.tsx";


function App() {


  return (

      <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<FirstPage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/signup" element={<SignupPage/>} />
              <Route path="/home" element={<HomePage/>}/>

            </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App
