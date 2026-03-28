import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import MedicinePieChart from "../components/charts/MedicinePieChart";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Patient","role":"patient"}');

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role="Patient" />
      <main className="main-panel">
        <RoleTopbar name={user.name || "Patient"} role="Patient" alerts={2} pills={4} notifications={5} />

        <div className="page-header">
          <div>
            <div className="page-title">My Health Dashboard</div>
            <div className="page-subtitle">Read-only access to your health records</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon blue">💊</div> Today's Medicines</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {time:"8:00 AM", name:"Paracetamol 500mg", status:"Taken", icon:"✅"},
                {time:"1:00 PM", name:"Vitamin D3", status:"Pending", icon:"⏳"},
                {time:"9:00 PM", name:"BP Tablet 250mg", status:"Pending", icon:"⏳"},
              ].map((m,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px',background:'var(--bg)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
                  <span style={{fontSize:'1.4rem'}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'0.92rem'}}>{m.name}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--text-soft)'}}>{m.time}</div>
                  </div>
                  <span className={`status-pill ${m.status.toLowerCase()}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon teal">🩺</div> My Condition</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                {label:"Illness", value:"Post-surgery recovery"},
                {label:"Condition", value:"Stable"},
                {label:"Doctor's Note", value:"Continue hydration and regular tablets"},
                {label:"Last Updated", value:"Today, 9:00 AM"},
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'var(--bg)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <span style={{color:'var(--muted)',fontSize:'0.85rem',fontWeight:600}}>{item.label}</span>
                  <span style={{color:'var(--text)',fontSize:'0.88rem',fontWeight:700}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon orange">📊</div> Medicine Adherence</h3>
            </div>
            <MedicinePieChart />
          </div>

          <div className="glass-card section-card animate-in">
            <div className="section-header">
              <h3><div className="section-icon green">📅</div> Upcoming Appointments</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {date:"Tomorrow", time:"10:30 AM", doctor:"Dr. Tarun", type:"General Review"},
                {date:"Next Monday", time:"2:00 PM", doctor:"Dr. Priya", type:"Blood Test Review"},
              ].map((a,i)=>(
                <div key={i} style={{display:'flex',gap:'14px',padding:'14px',background:'var(--bg)',borderRadius:'var(--radius)',border:'1px solid rgba(37,99,235,0.15)'}}>
                  <span style={{fontSize:'1.4rem'}}>📅</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.92rem'}}>{a.type}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--text-soft)'}}>{a.doctor} · {a.date} at {a.time}</div>
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

export default PatientDashboard;