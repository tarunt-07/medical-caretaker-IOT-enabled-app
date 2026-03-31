import { useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { api } from "../services/api";

function Logs() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Caretaker","role":"caretaker"}');
  const role = user.role || "caretaker";
  const sidebarRole = role.charAt(0).toUpperCase() + role.slice(1);
  const isCaretaker = role === "caretaker";
  const isMobileLayout = typeof window !== "undefined" && window.innerWidth < 960;

  const [logs, setLogs] = useState([
    { id: 1, date: "2025-01-10", note: "Patient had a good morning. All medicines taken on time.", by: "Tarun Kumar" },
    { id: 2, date: "2025-01-09", note: "Mild fever observed (99.2 F). Doctor notified.", by: "Tarun Kumar" },
    { id: 3, date: "2025-01-08", note: "Morning medicine missed - administered with 1hr delay.", by: "Priya Singh" },
  ]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!note.trim()) return;

    setSubmitting(true);
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      note,
      by: user.name || "Caretaker",
    };

    try {
      await api.addLog({ note });
    } catch (error) {
      console.warn("Backend offline:", error.message);
    }

    setLogs((prev) => [newLog, ...prev]);
    setNote("");
    setSubmitting(false);
  };

  const handleDelete = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name || "User"} role={sidebarRole} alerts={2} pills={4} notifications={3} />
        <div className="page-header">
          <div>
            <div className="page-title">Daily Logs</div>
            <div className="page-subtitle">Day-to-day patient observations</div>
          </div>
        </div>

        {confirmDelete && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="glass-card"
              style={{ width: "min(360px, calc(100vw - 32px))", padding: "28px", textAlign: "center" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>!</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>Delete Log Entry?</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Delete log from <strong>{confirmDelete.date}</strong>? This cannot be undone.
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius)",
                    border: "none",
                    background: "var(--danger)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCaretaker && !isMobileLayout ? "1fr 1.5fr" : "1fr",
            gap: "20px",
          }}
        >
          {isCaretaker && (
            <div className="glass-card section-card animate-in">
              <div className="section-header">
                <h3>
                  <div className="section-icon blue">Add</div> Add Today's Log
                </h3>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <textarea
                  placeholder="Describe patient condition today..."
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius)",
                    border: "1.5px solid var(--border)",
                    outline: "none",
                    background: "var(--white)",
                    color: "var(--text)",
                    resize: "vertical",
                    fontSize: "0.92rem",
                  }}
                />
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Submit & Notify Doctor"}
                </button>
              </form>
            </div>
          )}

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3>
                <div className="section-icon teal">Logs</div> Log History
              </h3>
            </div>
            <div className="log-box">
              {logs.map((log) => (
                <div key={log.id} className="log-entry" style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                      <div className="log-date">{log.date} - by {log.by}</div>
                      <div className="log-note">{log.note}</div>
                    </div>
                    {(isCaretaker || user.role === "doctor") && (
                      <button
                        onClick={() => setConfirmDelete(log)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          background: "#fee2e2",
                          color: "var(--danger)",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          flexShrink: 0,
                          marginLeft: "10px",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Logs;
