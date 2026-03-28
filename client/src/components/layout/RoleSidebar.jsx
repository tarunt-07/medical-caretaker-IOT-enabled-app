import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../branding/BrandLogo";

const NAV = {
  Doctor: [
    { icon: "Dashboard", label: "Dashboard", path: "/doctor-dashboard" },
    { icon: "Patients", label: "Patients", path: "/patients" },
    { icon: "Rx", label: "Prescriptions", path: "/prescriptions" },
    { icon: "History", label: "Medical History", path: "/medical-history" },
    { icon: "Visits", label: "Appointments", path: "/appointments" },
    { icon: "Reports", label: "Reports", path: "/reports" },
    { icon: "Chat", label: "Chat", path: "/chat" },
    { icon: "Alerts", label: "Notifications", path: "/notifications" },
    { icon: "Devices", label: "IoT Devices", path: "/devices" },
  ],
  Caretaker: [
    { icon: "Dashboard", label: "Dashboard", path: "/caretaker-dashboard" },
    { icon: "Meds", label: "Medicine Schedule", path: "/prescriptions" },
    { icon: "Logs", label: "Daily Logs", path: "/logs" },
    { icon: "Alerts", label: "Alerts", path: "/notifications" },
    { icon: "Visits", label: "Appointments", path: "/appointments" },
    { icon: "Chat", label: "Chat with Doctor", path: "/chat" },
    { icon: "Devices", label: "IoT Devices", path: "/devices" },
    { icon: "Profile", label: "Profile", path: "/profile" },
  ],
  Patient: [
    { icon: "Dashboard", label: "Dashboard", path: "/patient-dashboard" },
    { icon: "Meds", label: "My Medicines", path: "/prescriptions" },
    { icon: "Records", label: "My Records", path: "/medical-history" },
    { icon: "Visits", label: "Appointments", path: "/appointments" },
    { icon: "Alerts", label: "Notifications", path: "/notifications" },
    { icon: "Profile", label: "Profile", path: "/profile" },
  ],
};

function RoleSidebar({ role }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const links = NAV[role] || NAV.Patient;
  const initials = (user.name || role)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <BrandLogo size="sm" subtitle="Care workspace" />
      </div>

      <div className="sidebar-section-label">Navigation</div>
      <nav>
        {links.map((item) => (
          <Link key={item.path} to={item.path}>
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name || "User"}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>
        <button className="btn btn-ghost full-width" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default RoleSidebar;
