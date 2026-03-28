import { useMemo, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { CARE_PATIENTS } from "../data/mockClinicData";

function MedicalHistory() {
  const user = JSON.parse(
    localStorage.getItem("user") || '{"name":"Tarunk","role":"caretaker","id":4}'
  );
  const sidebarRole =
    (user.role || "caretaker").charAt(0).toUpperCase() +
    (user.role || "caretaker").slice(1);

  const [selectedId, setSelectedId] = useState(CARE_PATIENTS[0].id);

  const selectedPatient = useMemo(
    () => CARE_PATIENTS.find((patient) => patient.id === Number(selectedId)) || CARE_PATIENTS[0],
    [selectedId]
  );

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">Medical Records</div>
            <div className="page-subtitle">
              Complete patient history, reports, allergies, medicines, and doctor notes.
            </div>
          </div>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            style={{
              minWidth: "230px",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.16)",
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

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1.05fr 1.35fr" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Patient Snapshot
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  ["Patient", selectedPatient.name],
                  ["Condition", selectedPatient.condition],
                  ["Doctor", selectedPatient.doctor],
                  ["Caretaker", selectedPatient.caretaker],
                  ["Blood Group", selectedPatient.bloodGroup],
                  ["Next Appointment", selectedPatient.nextAppointment],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "14px",
                      padding: "12px 14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ color: "var(--muted)", fontWeight: 600 }}>{label}</span>
                    <span style={{ color: "#f4fbff", fontWeight: 700, textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Latest Vitals
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                {Object.entries(selectedPatient.vitals).map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase" }}>
                      {label}
                    </div>
                    <div style={{ marginTop: "6px", fontSize: "1rem", fontWeight: 800 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Active Medicines
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {selectedPatient.medicines.map((medicine) => (
                  <div
                    key={medicine.name}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ fontWeight: 800 }}>{medicine.name}</div>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          padding: "5px 10px",
                          borderRadius: "999px",
                          background: "rgba(33,199,207,0.16)",
                          color: "#97f0ff",
                        }}
                      >
                        {medicine.status}
                      </span>
                    </div>
                    <div style={{ marginTop: "6px", color: "var(--muted)" }}>
                      {medicine.dosage} • {medicine.schedule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                Full Medical Record
              </div>
              <div style={{ display: "grid", gap: "14px" }}>
                {[
                  ["Medical History", selectedPatient.history],
                  ["Reports", selectedPatient.reports],
                  ["Doctor Notes", selectedPatient.notes],
                  ["Allergies", selectedPatient.allergies.length ? selectedPatient.allergies : ["No known allergies"]],
                ].map(([label, items]) => (
                  <div
                    key={label}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ marginBottom: "8px", fontWeight: 800 }}>{label}</div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {items.map((item) => (
                        <div key={item} style={{ color: "#dbe9f4", lineHeight: 1.55 }}>
                          • {item}
                        </div>
                      ))}
                    </div>
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

export default MedicalHistory;
