import { useState, useEffect, useCallback } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { api } from "../services/api";

const FALLBACK = [
  { id: 1, patientId: 1, title: "Blood Test Report", type: "blood_test", status: "reviewed", uploadedBy: "Tarun Caretaker", reviewedBy: "Dr. Tarun Kumar", notes: "Hemoglobin slightly low, iron supplement recommended.", createdAt: "2025-01-08T00:00:00Z" },
  { id: 2, patientId: 1, title: "ECG Report", type: "ecg", status: "pending", uploadedBy: "Tarun Caretaker", reviewedBy: null, notes: "", createdAt: "2025-01-10T00:00:00Z" },
  { id: 3, patientId: 2, title: "BP Monitoring Report", type: "bp_report", status: "reviewed", uploadedBy: "Priya Caretaker", reviewedBy: "Dr. Priya Sharma", notes: "Consistent high BP, dosage increased.", createdAt: "2025-01-07T00:00:00Z" },
  { id: 4, patientId: 3, title: "HbA1c Test", type: "blood_test", status: "pending", uploadedBy: "Priya Caretaker", reviewedBy: null, notes: "", createdAt: "2025-01-10T00:00:00Z" },
];

const FALLBACK_PATIENTS = [
  { id: 1, name: "Rahul Sharma" }, { id: 2, name: "Meena Devi" }, { id: 3, name: "Arjun Singh" },
];

const statusColor = { reviewed: "var(--success)", pending: "var(--warning)" };
const statusBg = { reviewed: "#dcfce7", pending: "#fef9c3" };
const typeIcon = { blood_test: "🩸", ecg: "💓", bp_report: "🩺", general: "📄" };

function Reports() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor","id":1}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [reports, setReports] = useState(FALLBACK);
  const [patients, setPatients] = useState(FALLBACK_PATIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ patientId: "", title: "", type: "blood_test" });
  const [saving, setSaving] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadReports = useCallback(async () => {
    try {
      const res = await api.getReports();
      if (res.success && res.data?.length) setReports(res.data);
    } catch (err) { console.error("Failed to load reports:", err); }
  }, []);

  const loadPatients = useCallback(async () => {
    try {
      const res = await api.getPatients();
      if (res.success && res.data?.length) setPatients(res.data);
    } catch (err) { console.error("Failed to load patients:", err); }
  }, []);

  useEffect(() => {
    const fetchData = async () => { await Promise.all([loadReports(), loadPatients()]); };
    fetchData();
  }, [loadReports, loadPatients]);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.patientId) return;
    setSaving(true);
    try {
      const res = await api.addReport({ ...form, uploadedBy: user.name });
      if (res.success) setReports(prev => [...prev, res.data]);
      else setReports(prev => [...prev, { id: Date.now(), ...form, status: "pending", uploadedBy: user.name, reviewedBy: null, notes: "", createdAt: new Date().toISOString() }]);
    } catch {
      setReports(prev => [...prev, { id: Date.now(), ...form, status: "pending", uploadedBy: user.name, reviewedBy: null, notes: "", createdAt: new Date().toISOString() }]);
    }
    setForm({ patientId: "", title: "", type: "blood_test" });
    setShowAdd(false);
    setSaving(false);
  };

  const handleReview = async (id) => {
    try { await api.reviewReport(id, { reviewedBy: user.name, notes: reviewNote }); }
    catch (err) { console.error("Failed to submit review:", err); }
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "reviewed", reviewedBy: user.name, notes: reviewNote } : r));
    setReviewingId(null);
    setReviewNote("");
  };

  const handleDelete = async (id) => {
    try { await api.deleteReport(id); } catch (err) { console.error("Failed to delete:", err); }
    setReports(prev => prev.filter(r => r.id !== id));
    setConfirmDelete(null);
  };

  const getPatientName = (id) => patients.find(p => p.id === Number(id))?.name || `Patient #${id}`;

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">📊 Reports</div>
            <div className="page-subtitle">{reports.filter(r => r.status === "pending").length} pending review</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Upload Report</button>
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div className="glass-card" style={{ width: "min(360px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>Delete Report?</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Delete <strong>{confirmDelete.title}</strong>? This cannot be undone.
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
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div className="glass-card" style={{ width: "min(420px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>Upload Report</div>
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
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Report Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none" }}>
                    <option value="blood_test">Blood Test</option>
                    <option value="ecg">ECG</option>
                    <option value="bp_report">BP Report</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAdd} disabled={saving} style={{ flex: 1 }}>{saving ? "Uploading..." : "Upload"}</button>
                <button className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reports.map(r => (
            <div key={r.id} className="glass-card" style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                  {typeIcon[r.type] || "📄"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 800, color: "var(--text)", fontSize: "0.95rem" }}>{r.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: statusColor[r.status], background: statusBg[r.status], padding: "4px 12px", borderRadius: "999px", textTransform: "capitalize" }}>
                        {r.status}
                      </span>
                      {user.role === "doctor" && (
                        <button onClick={() => setConfirmDelete(r)}
                          style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", border: "none", background: "#fee2e2", color: "var(--danger)", fontSize: "0.78rem", cursor: "pointer" }}>
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "4px" }}>
                    👤 {getPatientName(r.patientId)} &nbsp;·&nbsp; 📤 {r.uploadedBy} &nbsp;·&nbsp; 📅 {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  {r.notes && <div style={{ marginTop: "8px", padding: "8px 12px", borderRadius: "var(--radius)", background: "var(--bg)", fontSize: "0.83rem", color: "var(--text)" }}>📝 {r.notes}</div>}
                  {r.reviewedBy && <div style={{ marginTop: "6px", fontSize: "0.78rem", color: "var(--success)" }}>✅ Reviewed by {r.reviewedBy}</div>}
                  {user.role === "doctor" && r.status === "pending" && (
                    <div style={{ marginTop: "12px" }}>
                      {reviewingId === r.id ? (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <input value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="Add review notes..."
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--primary)", background: "var(--white)", color: "var(--text)", fontSize: "0.85rem", outline: "none" }} />
                          <button onClick={() => handleReview(r.id)} style={{ padding: "8px 14px", borderRadius: "var(--radius)", border: "none", background: "var(--success)", color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>✓ Submit</button>
                          <button onClick={() => setReviewingId(null)} style={{ padding: "8px 12px", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--white)", color: "var(--muted)", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setReviewingId(r.id)} style={{ padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--primary-glow)", color: "var(--primary)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                          📝 Review Report
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Reports;
