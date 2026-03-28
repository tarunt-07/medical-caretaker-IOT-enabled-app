import { useEffect, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import MedicineCard from "../components/cards/MedicineCard";
import AlertCard from "../components/cards/AlertCard";
import RecoveryBarChart from "../components/charts/RecoveryBarChart";
import { api } from "../services/api";

const DEFAULT_MEDICINES = [
  { id: 1, name: "Paracetamol", dosage: "500 mg", time: "8:00 AM", status: "Taken" },
  { id: 2, name: "Vitamin D3", dosage: "1 Tablet", time: "1:00 PM", status: "Pending" },
  { id: 3, name: "BP Tablet", dosage: "250 mg", time: "9:00 PM", status: "Pending" },
];

const DEFAULT_ALERTS = [
  { id: 1, title: "Missed Pill Alert", message: "Morning medicine was not marked as taken.", level: "high" },
  { id: 2, title: "Doctor Review Pending", message: "Doctor approval required for medicine alteration.", level: "high" },
  { id: 3, title: "Device Online", message: "Smart dispenser connected successfully.", level: "low" },
];

function CaretakerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Caretaker","role":"caretaker"}');

  useEffect(() => {
    api.getDashboard("caretaker").then(r => { if (r.success) setDashboard(r.data); });
  }, []);

  const medicines = dashboard?.medicines?.length ? dashboard.medicines : DEFAULT_MEDICINES;
  const alertsList = dashboard?.alertsList?.length ? dashboard.alertsList : DEFAULT_ALERTS;

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role="Caretaker" />
      <main className="main-panel">
        <RoleTopbar name={user.name || "Caretaker"} role="Caretaker" alerts={dashboard?.alerts || 3} pills={dashboard?.pills || 5} notifications={dashboard?.notifications || 7} />

        <div className="page-header">
          <div>
            <div className="page-title">Caretaker Dashboard</div>
            <div className="page-subtitle">Manage daily medicine schedule and patient logs</div>
          </div>
          <button className="btn btn-teal">+ Add Log Entry</button>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon blue">💊</div> Today's Medicine Schedule</h3>
            </div>
            <div className="medicine-list">
              {medicines.map(m => (
                <MedicineCard key={m.id} name={m.medicine || m.name} dosage={m.dosage} time={m.frequency || m.time} status={m.status} />
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon orange">🚨</div> Critical Alerts</h3>
            </div>
            <div className="alert-list">
              {alertsList.map(a => (
                <AlertCard key={a.id} title={a.title} text={a.message || a.text} type={a.level === "high" ? "danger" : "info"} />
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon green">📈</div> Recovery Progress</h3>
            </div>
            <RecoveryBarChart />
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon teal">🧑</div> Patient Condition</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                {label:"Patient Name", value:"Rahul Sharma"},
                {label:"Current Illness", value:"Post-surgery recovery"},
                {label:"Condition", value:"Stable, under observation"},
                {label:"Doctor Note", value:"Continue medicine and hydration"},
                {label:"Next Appointment", value:"Tomorrow 10:30 AM"},
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'var(--bg)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <span style={{color:'var(--muted)',fontSize:'0.85rem',fontWeight:600}}>{item.label}</span>
                  <span style={{color:'var(--text)',fontSize:'0.88rem',fontWeight:700}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in" style={{gridColumn:'1 / -1'}}>
            <div className="section-header">
              <h3><div className="section-icon teal">📡</div> Smart Dispenser Status</h3>
              <a href="/devices" className="btn btn-ghost" style={{fontSize:'0.82rem'}}>Manage →</a>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
              <div className="device-stat" style={{padding:'16px'}}>
                <div className="device-stat-label">Device Status</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'6px'}}>
                  <div className="device-dot online"></div>
                  <span style={{fontWeight:700,color:'var(--success)'}}>Online</span>
                </div>
              </div>
              <div className="device-stat" style={{padding:'16px'}}>
                <div className="device-stat-label">Last Dispensed</div>
                <div className="device-stat-value">8:02 AM</div>
              </div>
              <div className="device-stat" style={{padding:'16px'}}>
                <div className="device-stat-label">Pills Remaining</div>
                <div className="device-stat-value">14</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CaretakerDashboard;