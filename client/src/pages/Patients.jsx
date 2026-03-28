import { useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";

function Patients() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor","id":1}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [patients, setPatients] = useState([
    { id: 1, name: "Rahul Sharma", age: 58, gender: "Male", condition: "Stable" },
    { id: 2, name: "Meena Devi", age: 64, gender: "Female", condition: "Under observation" },
    { id: 3, name: "Arjun Singh", age: 45, gender: "Male", condition: "Critical" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", condition: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = () => {
    if (!form.name.trim() || !form.age) return;
    setPatients(prev => [...prev, { id: Date.now(), ...form, age: Number(form.age) }]);
    setForm({ name: "", age: "", gender: "Male", condition: "" });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
  };

  const conditionColor = { Stable: "var(--success)", Critical: "var(--danger)", "Under observation": "var(--warning)" };
  const conditionBg = { Stable: "#dcfce7", Critical: "#fee2e2", "Under observation": "#fef9c3" };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">🧑‍⚕️ Patients</div>
            <div className="page-subtitle">{patients.length} patients registered</div>
          </div>
          {user.role === "doctor" && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Patient</button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "420px", padding: "28px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px" }}>Add Patient</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[["name","Full Name *"], ["age","Age *"], ["condition","Condition"]].map(([key, label]) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>{label}</label>
                    <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Gender</label>
                  <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none" }}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Add</button>
                <button className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "360px", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>Delete Patient?</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
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

        {/* Patient Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {patients.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--teal))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1rem" }}>
                  {p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                {user.role === "doctor" && (
                  <button onClick={() => setConfirmDelete(p)}
                    style={{ padding: "5px 10px", borderRadius: "var(--radius-sm)", border: "none", background: "#fee2e2", color: "var(--danger)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
              <div style={{ marginTop: "12px", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>{p.name}</div>
              <div style={{ fontSize: "0.83rem", color: "var(--muted)", marginTop: "4px" }}>Age: {p.age} · {p.gender}</div>
              <div style={{ marginTop: "10px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: conditionColor[p.condition] || "var(--muted)", background: conditionBg[p.condition] || "#f3f4f6", padding: "4px 12px", borderRadius: "999px" }}>
                  {p.condition}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Patients;