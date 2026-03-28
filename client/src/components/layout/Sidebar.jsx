import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>prantar.io</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chat">Doctor Chat</Link>
        <Link to="/logs">Daily Logs</Link>
        <Link to="/devices">IoT Devices</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
