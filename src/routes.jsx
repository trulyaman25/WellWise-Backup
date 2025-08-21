import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import Home from "./sections/home/home";
import Login from "./sections/auth/login/login";
import Register from "./sections/auth/register/register";
import PatientProfileBuilder from "./sections/auth/register/profileBuilder/patientProfileBuilder/patientProfile";

import PatientDashboardLayout from "./sections/dashboard/patientDashboardLayout";
import PatientHome from "./sections/dashboard/pages/patientHome";
import MentalHealthTest from "./sections/dashboard/pages/mentalHealthTest/mhTest";

import Header from "./sections/navigation/header/header";
import Footer from "./sections/navigation/footer/footer";
import TestDashboard from "./sections/dashboard/pages/mentalHealthTest/testDashboard";

import Report from "./sections/dashboard/pages/mentalHealthTest/report";

function HomeRendering() {
    return (
        <>
            <Header />
            <Home />
            <Analytics />
            <Footer />
        </>
    )
}

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeRendering />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/patient/profile/:uniqueID" element={<PatientProfileBuilder />} />

                <Route path="/patient/:healthID" element={<PatientDashboardLayout />}>
                    <Route path='home' element={<PatientHome />} />
                    <Route path="mht/:testID" element={<TestDashboard />}/>
                </Route>

                <Route path="/patient/:healthID/takeTest" element={<MentalHealthTest />}/>
                <Route path="/patient/ack/:healthID/:testID" element={<Report />}/>
            </Routes>
        </Router>
    );
}

export default AppRoutes;