import { useMemo, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { CARE_PATIENTS, CARETAKER_ACTIONS } from "../data/mockClinicData";

const roleAccess = {
  doctor: [
    "View all patients",
    "Approve caretaker requests",
    "Review reports and appointments",
    "Coordinate treatment changes",
    "Use Prantar Assist for patient summaries",
  ],
  caretaker: CARETAKER_ACTIONS,
  patient: [
    "View own medicines",
    "View appointments",
    "View reports",
    "Track daily health updates",
  ],
};

function Profile() {
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user") ||
        '{"name":"Tarunk","role":"caretaker","email":"user@test.com","phone":"+91 98765 43210","specialization":"Home Recovery Care"}'
    )
  );
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(CARE_PATIENTS[0].id);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    specialization: user.specialization || "",
  });

  const sidebarRole =
    (user.role || "caretaker").charAt(0).toUpperCase() +
    (user.role || "caretaker").slice(1);

  const selectedPatient = useMemo(
    () => CARE_PATIENTS.find((patient) => patient.id === Number(selectedPatientId)) || CARE_PATIENTS[0],
    [selectedPatientId]
  );

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const initials =
    user.name?.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={1} pills={3} notifications={2} />

        <div className="page-header">
          <div>
            <div className="page-title">My Profile</div>
            <div className="page-subtitle">
              Manage account details, caretaker permissions, and assigned patient context.
            </div>
          </div>
          {!editing ? (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "0.95fr 1.45fr" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="section-card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#04111b",
                  background: "linear-gradient(135deg, #22c6ce, #67a7ff)",
                }}
              >
                {initials}
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>{user.name}</div>
              <div style={{ marginTop: "6px", color: "var(--muted)" }}>{user.email}</div>
              <div
                style={{
                  marginTop: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  background: "rgba(33,199,207,0.14)",
                  color: "#a7f1ff",
                  fontWeight: 700,
                }}
              >
                {sidebarRole}
              </div>
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  color: "#d7e7f2",
                }}
              >
                Managing {CARE_PATIENTS.length} assigned patients and coordinating daily recovery updates.
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "14px" }}>
                Access Level
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                {(roleAccess[user.role] || []).map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.05)",
                      color: "#eef7ff",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Account Information
              </div>
              {saved && (
                <div
                  style={{
                    marginBottom: "14px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "rgba(54,211,153,0.18)",
                    color: "#c9ffe9",
                    fontWeight: 700,
                  }}
                >
                  Profile updated successfully.
                </div>
              )}
              <div style={{ display: "grid", gap: "14px" }}>
                {[["name", "Full Name"], ["phone", "Phone Number"], ["specialization", "Specialization"]].map(
                  ([key, label]) => (
                    <div key={key}>
                      <label style={{ display: "block", marginBottom: "6px", color: "var(--muted)" }}>
                        {label}
                      </label>
                      {editing ? (
                        <input
                          value={form[key]}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, [key]: event.target.value }))
                          }
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.1)",
                            color: "#f3fbff",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            padding: "12px 14px",
                            borderRadius: "14px",
                            background: "rgba(255,255,255,0.05)",
                            color: "#edf7ff",
                          }}
                        >
                          {user[key] || "Not set"}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="section-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div className="section-title">Assigned Patient Preview</div>
                <select
                  value={selectedPatientId}
                  onChange={(event) => setSelectedPatientId(event.target.value)}
                  style={{
                    minWidth: "220px",
                    padding: "10px 12px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#f4fbff",
                  }}
                >
                  {CARE_PATIENTS.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  ["Condition", selectedPatient.condition],
                  ["Doctor", selectedPatient.doctor],
                  ["Latest Vitals", `${selectedPatient.vitals.bp} • ${selectedPatient.vitals.pulse}`],
                  ["Reports", selectedPatient.reports.join(", ")],
                  ["Next Appointment", selectedPatient.nextAppointment],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ color: "var(--muted)", marginBottom: "4px" }}>{label}</div>
                    <div style={{ color: "#f3fbff", fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
