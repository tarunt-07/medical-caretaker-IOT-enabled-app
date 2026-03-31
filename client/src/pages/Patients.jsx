import { useEffect, useMemo, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { api } from "../services/api";

const DEFAULT_PATIENT_FORM = {
  name: "",
  age: "",
  gender: "Male",
  condition: "",
  firstAidText: "",
};

function normalizeGuidance(value) {
  if (Array.isArray(value)) return value;

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Patients() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor","id":1}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [form, setForm] = useState(DEFAULT_PATIENT_FORM);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api.getPatients().then((response) => {
      if (isMounted && response.success) {
        setPatients(response.data || []);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const patientCountLabel = useMemo(() => `${patients.length} patients registered`, [patients.length]);

  const resetForm = () => {
    setForm(DEFAULT_PATIENT_FORM);
    setEditingPatientId(null);
    setFormMode("add");
    setShowForm(false);
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingPatientId(null);
    setForm(DEFAULT_PATIENT_FORM);
    setShowForm(true);
  };

  const openEditModal = (patient) => {
    setFormMode("edit");
    setEditingPatientId(patient.id);
    setForm({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      condition: patient.condition || "",
      firstAidText: normalizeGuidance(patient.firstAidGuidance).join("\n"),
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.age || !form.condition.trim()) return;

    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      condition: form.condition.trim(),
      firstAidGuidance: normalizeGuidance(form.firstAidText),
    };

    if (formMode === "edit" && editingPatientId !== null) {
      const response = await api.updatePatient(editingPatientId, payload);
      if (response.success && response.data) {
        setPatients((current) =>
          current.map((patient) =>
            Number(patient.id) === Number(editingPatientId) ? response.data : patient
          )
        );
        resetForm();
      }
      return;
    }

    const response = await api.addPatient(payload);
    if (response.success && response.data) {
      setPatients((current) => [...current, response.data]);
      resetForm();
    }
  };

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((patient) => Number(patient.id) !== Number(id)));
    setConfirmDelete(null);
  };

  const conditionColor = {
    Stable: "var(--success)",
    Critical: "var(--danger)",
    "Under observation": "var(--warning)",
  };

  const conditionBg = {
    Stable: "#dcfce7",
    Critical: "#fee2e2",
    "Under observation": "#fef9c3",
  };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">Patients</div>
            <div className="page-subtitle">{patientCountLabel}</div>
          </div>
          {user.role === "doctor" && (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add Patient
            </button>
          )}
        </div>

        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div className="glass-card" style={{ width: "min(560px, 100%)", padding: "28px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px" }}>
                {formMode === "edit" ? "Edit Patient Care Plan" : "Add Patient"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[["name", "Full Name *"], ["age", "Age *"], ["condition", "Condition *"]].map(
                  ([key, label]) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--muted)",
                          marginBottom: "4px",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        value={form[key]}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, [key]: event.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "var(--radius)",
                          border: "1.5px solid var(--border)",
                          background: "var(--white)",
                          color: "var(--text)",
                          fontSize: "0.88rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  )
                )}

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: "4px",
                    }}
                  >
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "var(--radius)",
                      border: "1.5px solid var(--border)",
                      background: "var(--white)",
                      color: "var(--text)",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: "4px",
                    }}
                  >
                    Doctor-Specified First Aid Guidance
                  </label>
                  <textarea
                    value={form.firstAidText}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, firstAidText: event.target.value }))
                    }
                    rows={5}
                    placeholder="Enter one first-aid instruction per line for the caretaker."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius)",
                      border: "1.5px solid var(--border)",
                      background: "var(--white)",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
                  {formMode === "edit" ? "Save Guidance" : "Add Patient"}
                </button>
                <button className="btn btn-ghost" onClick={resetForm} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
              padding: "20px",
            }}
          >
            <div className="glass-card" style={{ width: "min(360px, 100%)", maxHeight: "90vh", overflowY: "auto", padding: "28px", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "8px" }}>
                Delete Patient?
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {patients.map((patient) => {
            const firstAidGuidance = normalizeGuidance(patient.firstAidGuidance);

            return (
              <div key={patient.id} className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), var(--teal))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}
                  >
                    {patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </div>

                  {user.role === "doctor" && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button className="btn btn-ghost" onClick={() => openEditModal(patient)} style={{ fontSize: "0.78rem" }}>
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(patient)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          background: "#fee2e2",
                          color: "var(--danger)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "12px", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
                  {patient.name}
                </div>
                <div style={{ fontSize: "0.83rem", color: "var(--muted)", marginTop: "4px" }}>
                  Age: {patient.age} · {patient.gender}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: conditionColor[patient.condition] || "var(--muted)",
                      background: conditionBg[patient.condition] || "#f3f4f6",
                      padding: "4px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    {patient.condition}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px",
                    borderRadius: "18px",
                    background: "rgba(18, 115, 115, 0.08)",
                    border: "1px solid rgba(18, 115, 115, 0.14)",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: "10px", color: "var(--text)" }}>
                    First Aid Guidance
                  </div>
                  {firstAidGuidance.length ? (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {firstAidGuidance.map((item, index) => (
                        <div key={`${patient.id}-${index}`} style={{ color: "var(--text-soft)", lineHeight: 1.55 }}>
                          {index + 1}. {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                      No doctor-specific first-aid guidance has been added yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Patients;
