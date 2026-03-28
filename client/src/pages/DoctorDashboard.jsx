import { useEffect, useState } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import RecoveryBarChart from "../components/charts/RecoveryBarChart";
import MedicinePieChart from "../components/charts/MedicinePieChart";
import { api } from "../services/api";

function DoctorDashboard() {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Dr. User","role":"doctor"}');

  useEffect(() => {
    api.getDashboard("doctor").then(r => { if (r.success) setData(r.data); });
  }, []);

  const patients = data?.patients || [
    { id: 1, name: "Rahul Sharma", condition: "Stable", note: "Doctor review due today" },
    { id: 2, name: "Meena Devi", condition: "Monitoring", note: "Missed medication alert raised" },
    { id: 3, name: "Arjun Singh", condition: "Critical", note: "Urgent prescription update needed" },
  ];

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role="Doctor" />
      <main className="main-panel">
        <RoleTopbar name={user.name || "Dr. User"} role="Doctor" alerts={data?.alerts || 4} pills={data?.pills || 12} notifications={data?.notifications || 9} />

        <div className="page-header">
          <div>
            <div className="page-title">Doctor Dashboard</div>
            <div className="page-subtitle">Full access — manage prescriptions, patients, reports</div>
          </div>
          <button className="btn btn-primary">+ New Prescription</button>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon blue">👥</div> Patient Overview</h3>
              <a href="/patients" className="btn btn-ghost" style={{fontSize:'0.82rem'}}>View all →</a>
            </div>
            <div className="patient-list">
              {patients.map(p => (
                <div className="patient-card" key={p.id}>
                  <div className="patient-avatar">{p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div className="patient-info">
                    <div className="patient-name">{p.name}</div>
                    <div className="patient-detail">{p.note}</div>
                  </div>
                  <span className={`condition-badge ${p.condition?.toLowerCase()}`}>{p.condition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon teal">💊</div> Prescription Control</h3>
              <button className="btn btn-teal" style={{fontSize:'0.82rem',padding:'8px 14px'}}>+ Add Rx</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {name:"Paracetamol 500mg", patient:"Rahul Sharma", status:"Active"},
                {name:"Vitamin D3", patient:"Meena Devi", status:"Pending approval"},
                {name:"BP Tablet 250mg", patient:"Arjun Singh", status:"Active"},
              ].map((rx,i) => (
                <div className="rx-card" key={i}>
                  <div className="rx-icon">💊</div>
                  <div className="rx-info">
                    <div className="rx-name">{rx.name}</div>
                    <div className="rx-detail">Patient: {rx.patient}</div>
                  </div>
                  <span className={`status-pill ${rx.status==='Active'?'taken':'pending'}`}>{rx.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon green">📈</div> Recovery Analytics</h3>
            </div>
            <RecoveryBarChart />
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon orange">📊</div> Medicine Adherence</h3>
            </div>
            <MedicinePieChart />
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon blue">📋</div> Pending Approvals</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {req:"Dosage change request", by:"Caretaker Tarun", time:"2 hrs ago"},
                {req:"New medicine added", by:"Caretaker Priya", time:"5 hrs ago"},
              ].map((a,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:'var(--bg)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
                  <span style={{fontSize:'1.2rem'}}>📝</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'0.9rem'}}>{a.req}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--text-soft)'}}>{a.by} · {a.time}</div>
                  </div>
                  <button className="btn btn-primary" style={{padding:'6px 12px',fontSize:'0.8rem'}}>Approve</button>
                  <button className="btn btn-outline" style={{padding:'6px 12px',fontSize:'0.8rem'}}>Reject</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon teal">📡</div> IoT Device Status</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                {name:"Smart Dispenser #1", status:"online", pills:3, sync:"2 min ago"},
                {name:"Smart Dispenser #2", status:"offline", pills:0, sync:"3 hrs ago"},
              ].map((d,i)=>(
                <div key={i} className="device-card">
                  <div className="device-header">
                    <div>
                      <div className="device-name">{d.name}</div>
                      <div className="device-type">Arduino/ESP32</div>
                    </div>
                    <div className="device-status">
                      <div className={`device-dot ${d.status}`}></div>
                      {d.status}
                    </div>
                  </div>
                  <div className="device-stats">
                    <div className="device-stat">
                      <div className="device-stat-label">Pills Pending</div>
                      <div className="device-stat-value">{d.pills}</div>
                    </div>
                    <div className="device-stat">
                      <div className="device-stat-label">Last Sync</div>
                      <div className="device-stat-value" style={{fontSize:'0.85rem'}}>{d.sync}</div>
                    </div>
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

export default DoctorDashboard;