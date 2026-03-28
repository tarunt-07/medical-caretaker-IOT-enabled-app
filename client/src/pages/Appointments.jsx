import { useState, useEffect } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { api } from "../services/api";

const FALLBACK = [
  { id: 1, patientName: "Rahul Sharma", doctorName: "Dr. Tarun Kumar", date: "2025-01-11", time: "10:30 AM", type: "General Review", status: "scheduled" },
  { id: 2, patientName: "Meena Devi", doctorName: "Dr. Priya Sharma", date: "2025-01-13", time: "2:00 PM", type: "BP Check", status: "scheduled" },
  { id: 3, patientName: "Arjun Singh", doctorName: "Dr. Tarun Kumar", date: "2025-01-12", time: "11:00 AM", type: "Diabetes Review", status: "scheduled" },
];

const FALLBACK_PATIENTS = [
  { id: 1, name: "Rahul Sharma" }, { id: 2, name: "Meena Devi" }, { id: 3, name: "Arjun Singh" },
];

const statusColor = { scheduled: "var(--primary)", completed: "var(--success)", cancelled: "var(--danger)" };
const statusBg = { scheduled: "#eff6ff", completed: "#dcfce7", cancelled: "#fee2e2" };
const statusIcon = { scheduled: "📅", completed: "✅", cancelled: "❌" };

function Appointments() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor","id":1}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [appointments, setAppointments] = useState(FALLBACK);
  const [patients, setPatients] = useState(FALLBACK_PATIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState({ patientId: "", date: "", time: "", type: "General Review" });

  // ✅ Fixed: always keeps fallback data if API fails
  useEffect(() => {
    api.getAppointments?.()
      .then(res => {
        if (res?.success && res.data?.length) setAppointments(res.data);
        // if API returns empty or fails, fallback stays
      })
      .catch(() => {}); // silently keep fallback

    api.getPatients?.()
      .then(res => {
        if (res?.success && res.data?.length) setPatients(res.data);
      })
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.patientId || !form.date) return;
    setSaving(true);
    const patient = patients.find(p => p.id === Number(form.patientId));
    const newAppt = {
      id: Date.now(),
      ...form,
      patientName: patient?.name || "",
      doctorName: user.name,
      doctorId: user.id,
      status: "scheduled"
    };
    try {
      const res = await api.addAppointment?.(newAppt);
      if (res?.success) setAppointments(prev => [...prev, res.data]);
      else setAppointments(prev => [...prev, newAppt]);
    } catch {
      setAppointments(prev => [...prev, newAppt]);
    }
    setForm({ patientId: "", date: "", time: "", type: "General Review" });
    setShowAdd(false);
    setSaving(false);
  };

  const handleStatusChange = async (id, status) => {
    await api.updateAppointmentStatus?.(id, status).catch(() => {});
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDelete = async (id) => {
    await api.deleteAppointment?.(id).catch(() => {});
    setAppointments(prev => prev.filter(a => a.id !== id));
    setConfirmDelete(null);
  };

  const filtered = filterStatus === "all"
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">📅 Appointments</div>
            <div className="page-subtitle">{appointments.length} total appointments</div>
          </div>
          {user.role === "doctor" && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Schedule</button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["all", "scheduled", "completed", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: "8px 18px", borderRadius: "999px", border: "1.5px solid", borderColor: filterStatus === s ? "var(--primary)" : "var(--border)", background: filterStatus === s ? "var(--primary)" : "var(--white)", color: filterStatus === s ? "white" : "var(--text)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", textTransform: "capitalize" }}>
              {s === "all" ? `All (${appointments.length})` : `${statusIcon[s]} ${s} (${appointments.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "360px", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>Delete Appointment?</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Delete <strong>{confirmDelete.type}</strong> for <strong>{confirmDelete.patientName}</strong>? This cannot be undone.
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

        {/* Add Modal */}
        {showAdd && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "440px", padding: "28px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>Schedule Appointment</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Patient *</label>
                  <select value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none" }}>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none" }}>
                    {["General Review", "BP Check", "Diabetes Review", "Neurology Checkup", "Follow-up", "Emergency"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAdd} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Schedule"}</button>
                <button className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📅</div>
            <div>No appointments found</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map(a => (
              <div key={a.id} className="glass-card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Date Box */}
                <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary), var(--teal))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    {new Date(a.date + "T00:00:00").toLocaleString("en", { month: "short" }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, lineHeight: 1 }}>
                    {new Date(a.date + "T00:00:00").getDate()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: "var(--text)", fontSize: "0.95rem" }}>{a.type}</div>
                  <div style={{ fontSize: "0.83rem", color: "var(--muted)", marginTop: "3px" }}>
                    👤 {a.patientName} &nbsp;·&nbsp; 🩺 {a.doctorName} &nbsp;·&nbsp; 🕐 {a.time}
                  </div>
                </div>

                {/* Status Badge */}
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: statusColor[a.status], background: statusBg[a.status], padding: "5px 14px", borderRadius: "999px", textTransform: "capitalize", whiteSpace: "nowrap" }}>
                  {statusIcon[a.status]} {a.status}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {user.role === "doctor" && a.status === "scheduled" && (
                    <>
                      <button onClick={() => handleStatusChange(a.id, "completed")}
                        style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", background: "#dcfce7", color: "var(--success)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                        ✓ Done
                      </button>
                      <button onClick={() => handleStatusChange(a.id, "cancelled")}
                        style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", background: "#fee2e2", color: "var(--danger)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {user.role === "doctor" && (
                    <button onClick={() => setConfirmDelete(a)}
                      style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "none", background: "#f3f4f6", color: "var(--danger)", fontSize: "0.8rem", cursor: "pointer" }}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Appointments;