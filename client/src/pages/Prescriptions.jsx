import { useMemo, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { CARE_PATIENTS } from "../data/mockClinicData";

const scheduleColors = {
  "On track": { color: "#8ff7d0", bg: "rgba(54,211,153,0.18)" },
  Taken: { color: "#8ff7d0", bg: "rgba(54,211,153,0.18)" },
  Pending: { color: "#ffe1a8", bg: "rgba(247,184,75,0.18)" },
  "Pending noon dose": { color: "#ffe1a8", bg: "rgba(247,184,75,0.18)" },
  Tonight: { color: "#b7d5ff", bg: "rgba(98,135,255,0.18)" },
};

function Prescriptions() {
  const user = JSON.parse(
    localStorage.getItem("user") || '{"name":"Tarunk","role":"caretaker","id":4}'
  );
  const sidebarRole =
    (user.role || "caretaker").charAt(0).toUpperCase() +
    (user.role || "caretaker").slice(1);

  const [selectedPatientId, setSelectedPatientId] = useState(CARE_PATIENTS[0].id);
  const [notes, setNotes] = useState("");
  const [markedMessage, setMarkedMessage] = useState("");

  const selectedPatient = useMemo(
    () => CARE_PATIENTS.find((patient) => patient.id === Number(selectedPatientId)) || CARE_PATIENTS[0],
    [selectedPatientId]
  );

  const handleMark = (medicineName, status) => {
    setMarkedMessage(`${medicineName} marked as ${status.toLowerCase()} for ${selectedPatient.name}.`);
    window.setTimeout(() => setMarkedMessage(""), 2200);
  };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={1} pills={selectedPatient.medicines.length} notifications={2} />

        <div className="page-header">
          <div>
            <div className="page-title">Medicine Schedule</div>
            <div className="page-subtitle">
              Track doses, review timing, and update adherence for each assigned patient.
            </div>
          </div>
          <select
            value={selectedPatientId}
            onChange={(event) => setSelectedPatientId(event.target.value)}
            style={{
              minWidth: "0",
              width: "100%",
              maxWidth: "220px",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(4,14,24,0.82)",
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

        {markedMessage && (
          <div
            className="glass-card"
            style={{
              marginBottom: "18px",
              padding: "14px 16px",
              color: "#cbffe9",
              background: "rgba(54,211,153,0.16)",
            }}
          >
            {markedMessage}
          </div>
        )}

        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div className="section-card">
            <div className="section-title" style={{ marginBottom: "16px" }}>
              Today&apos;s Schedule for {selectedPatient.name}
            </div>
            <div style={{ display: "grid", gap: "14px" }}>
              {selectedPatient.medicines.map((medicine) => {
                const palette = scheduleColors[medicine.status] || scheduleColors.Pending;
                return (
                  <div
                    key={medicine.name}
                    style={{
                      padding: "16px 18px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "1rem" }}>{medicine.name}</div>
                        <div style={{ color: "var(--muted)", marginTop: "4px" }}>
                          {medicine.dosage} • {medicine.schedule}
                        </div>
                      </div>
                      <span
                        style={{
                          height: "fit-content",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: palette.bg,
                          color: palette.color,
                          fontWeight: 700,
                          fontSize: "0.78rem",
                        }}
                      >
                        {medicine.status}
                      </span>
                    </div>

                    {(user.role === "caretaker" || user.role === "doctor") && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                        <button className="btn btn-primary" onClick={() => handleMark(medicine.name, "Taken")}>
                          Mark Taken
                        </button>
                        <button className="btn btn-ghost" onClick={() => handleMark(medicine.name, "Pending")}>
                          Mark Pending
                        </button>
                        <button className="btn btn-ghost" onClick={() => handleMark(medicine.name, "Needs review")}>
                          Needs Review
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Care Summary
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  ["Condition", selectedPatient.condition],
                  ["Doctor", selectedPatient.doctor],
                  ["BP", selectedPatient.vitals.bp],
                  ["Pulse", selectedPatient.vitals.pulse],
                  ["Next Appointment", selectedPatient.nextAppointment],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>{label}</span>
                    <span style={{ fontWeight: 700, color: "#f4fbff", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Caretaker Notes
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Write a short observation for the next doctor review..."
                style={{
                  minHeight: "140px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f5fbff",
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
                Tip: include missed doses, side effects, appetite, energy level, and any symptom changes.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Prescriptions;
