import { useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";

const INITIAL_NOTIFS = [
  { id: 1, title: "Missed Pill Alert", text: "Afternoon Vitamin D3 was not taken.", time: "1:05 PM", icon: "💊", level: "danger" },
  { id: 2, title: "IoT Device Offline", text: "Smart Dispenser #2 went offline.", time: "3 hrs ago", icon: "📡", level: "danger" },
  { id: 3, title: "Doctor Review Completed", text: "Dr. Tarun approved the new prescription.", time: "10:30 AM", icon: "✅", level: "success" },
  { id: 4, title: "Log Submitted", text: "Caretaker submitted today's morning log.", time: "9:15 AM", icon: "📝", level: "info" },
  { id: 5, title: "Appointment Reminder", text: "Tomorrow at 10:30 AM with Dr. Tarun.", time: "Yesterday", icon: "📅", level: "warning" },
];

function Notifications() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"caretaker"}');
  const role = user.role || "caretaker";
  const sidebarRole = role.charAt(0).toUpperCase() + role.slice(1);

  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
    setConfirmDelete(null);
  };

  const handleClearAll = () => {
    setNotifs([]);
  };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name || "User"} role={sidebarRole} alerts={2} pills={4} notifications={notifs.length} />

        <div className="page-header">
          <div>
            <div className="page-title">🔔 Notifications</div>
            <div className="page-subtitle">{notifs.length} alerts and updates</div>
          </div>
          {notifs.length > 0 && (
            <button onClick={handleClearAll}
              style={{ padding: "9px 18px", borderRadius: "var(--radius)", border: "1.5px solid var(--danger)", background: "transparent", color: "var(--danger)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "360px", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>Delete Notification?</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Delete <strong>{confirmDelete.title}</strong>?
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleDelete(confirmDelete.id)}
                  style={{ flex: 1, padding: "10px", borderRadius: "var(--radius)", border: "none", background: "var(--danger)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                  🗑️ Delete
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card section-card animate-in">
          {notifs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
              <div>All caught up! No notifications.</div>
            </div>
          ) : (
            <div className="alert-list">
              {notifs.map(n => (
                <div key={n.id} className={`alert-card ${n.level}`} style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span className="alert-icon">{n.icon}</span>
                    <div>
                      <div className="alert-title">{n.title}</div>
                      <div className="alert-text">{n.text}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{n.time}</span>
                    <button onClick={() => setConfirmDelete(n)}
                      style={{ padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "none", background: "#fee2e2", color: "var(--danger)", fontSize: "0.75rem", cursor: "pointer" }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;