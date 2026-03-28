import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorDashboard from "./pages/DoctorDashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import MedicalHistory from "./pages/MedicalHistory";
import Reports from "./pages/Reports";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Notifications from "./pages/Notifications";
import Chat from "./pages/chat";
import Logs from "./pages/Logs";
import Devices from "./pages/Devices";
import Profile from "./pages/Profile";
import Patients from "./pages/Patients";
import LoadingScreen from "./components/branding/LoadingScreen";

const PILL_ITEMS = Array.from({ length: 45 }, () => ({
  left: "10%",
  animationDelay: "0s",
  animationDuration: "5s",
  transform: "translateY(-120%) rotate(0deg)",
  opacity: "0.8",
}));

function getPageTheme(pathname) {
  if (pathname === "/") return "landing";
  if (pathname === "/login") return "login";
  if (pathname === "/signup") return "signup";
  if (pathname === "/doctor-dashboard") return "doctor-dashboard";
  if (pathname === "/caretaker-dashboard") return "caretaker-dashboard";
  if (pathname === "/patient-dashboard") return "patient-dashboard";
  if (pathname === "/appointments") return "appointments";
  if (pathname === "/reports") return "reports";
  if (pathname === "/prescriptions") return "prescriptions";
  if (pathname === "/chat") return "chat";
  if (pathname === "/profile") return "profile";
  if (pathname === "/medical-history") return "medical-history";
  if (pathname === "/patients") return "patients";
  if (pathname === "/devices") return "devices";
  if (pathname === "/notifications") return "notifications";
  if (pathname === "/logs") return "logs";
  return "clinical";
}

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    document.body.dataset.pageTheme = getPageTheme(location.pathname);

    return () => {
      delete document.body.dataset.pageTheme;
    };
  }, [location.pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLoader(false);
    }, 8000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LoadingScreen visible={showLoader} />
      <div className="pill-rain-container" aria-hidden="true">
        {PILL_ITEMS.map((style, i) => (
          <span key={i} className="pill-item" style={style} />
        ))}
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />

        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </>
  );
}

export default App;
