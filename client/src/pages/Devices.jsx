import { useState, useEffect } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";
import { api } from "../services/api";

const FALLBACK = [
  { id: 1, name: "Smart Dispenser #1", type: "Arduino/ESP32", status: "connected", patientId: 1, pillsRemaining: 14, pillsDispensed: 6, lastSync: "2025-01-10T08:02:00Z" },
  { id: 2, name: "Smart Dispenser #2", type: "Raspberry Pi", status: "offline", patientId: 2, pillsRemaining: 0, pillsDispensed: 0, lastSync: "2025-01-10T05:00:00Z" },
];

const EVENT_LOG = [
  { time: "08:02 AM", event: "💊 Pill dispensed", device: "Dispenser #1", level: "success" },
  { time: "07:58 AM", event: "🔗 Device connected", device: "Dispenser #1", level: "info" },
  { time: "05:00 AM", event: "📴 Device went offline", device: "Dispenser #2", level: "danger" },
  { time: "Yesterday", event: "💊 Pill dispensed", device: "Dispenser #1", level: "success" },
];

function Devices() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor"}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [devices, setDevices] = useState(FALLBACK);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Arduino/ESP32", patientId: "" });
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    api.getDevices().then(res => { if (res.success && res.data?.length) setDevices(res.data); }).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await api.connectDevice(form);
      if (res.success) setDevices(prev => [...prev, res.data]);
      else setDevices(prev => [...prev, { id: Date.now(), ...form, status: "connected", pillsRemaining: 0, pillsDispensed: 0, lastSync: new Date().toISOString() }]);
    } catch {
      setDevices(prev => [...prev, { id: Date.now(), ...form, status: "connected", pillsRemaining: 0, pillsDispensed: 0, lastSync: new Date().toISOString() }]);
    }
    setForm({ name: "", type: "Arduino/ESP32", patientId: "" });
    setShowAdd(false);
    setSaving(false);
  };

  const handleTestEvent = async () => {
    setTestResult("Sending...");
    try {
      const res = await api.sendArduinoEvent({ eventType: "pill_taken", deviceName: "Smart Dispenser #1", message: "Test pill dispensed" });
      setTestResult(res.success ? "✅ Event sent successfully!" : "⚠️ Server offline — event simulated");
    } catch { setTestResult("⚠️ Server offline — event simulated"); }
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={1} pills={0} notifications={1} />

        <div className="page-header">
          <div>
            <div className="page-title">📡 IoT Devices</div>
            <div className="page-subtitle">Smart dispenser management and monitoring</div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-ghost" onClick={handleTestEvent}>🧪 Test Event</button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Connect Device</button>
          </div>
        </div>

        {testResult && (
          <div style={{ padding: "12px 16px", borderRadius: "var(--radius)", background: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: "0.88rem", marginBottom: "16px" }}>{testResult}</div>
        )}

        {/* Add Modal */}
        {showAdd && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ width: "400px", padding: "28px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>Connect New Device</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Device Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Smart Dispenser #3"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "4px" }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.88rem", outline: "none" }}>
                    <option>Arduino/ESP32</option>
                    <option>Raspberry Pi</option>
                    <option>Custom Device</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAdd} disabled={saving} style={{ flex: 1 }}>{saving ? "Connecting..." : "Connect"}</button>
                <button className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Device Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {devices.map(d => (
              <div key={d.id} className="glass-card" style={{ padding: "20px", borderLeft: `4px solid ${d.status === "connected" ? "var(--success)" : "var(--danger)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ fontSize: "2rem" }}>📦</div>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--text)" }}>{d.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{d.type}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: d.status === "connected" ? "var(--success)" : "var(--danger)", background: d.status === "connected" ? "#dcfce7" : "#fee2e2", padding: "5px 14px", borderRadius: "999px" }}>
                    {d.status === "connected" ? "● Online" : "○ Offline"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[["💊", "Remaining", d.pillsRemaining], ["✅", "Dispensed", d.pillsDispensed], ["🕐", "Last Sync", d.lastSync ? new Date(d.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"]].map(([icon, label, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "10px", borderRadius: "var(--radius)", background: "var(--bg)" }}>
                      <div style={{ fontSize: "1.1rem" }}>{icon}</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{val}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Event Log + Arduino Guide */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "14px" }}>📜 Event Log</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {EVENT_LOG.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px", borderRadius: "var(--radius)", background: "var(--bg)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: "60px" }}>{e.time}</div>
                    <div style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)" }}>{e.event}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{e.device}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: "12px" }}>🔧 Arduino Setup</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7 }}>
                Send POST to: <code style={{ background: "var(--bg)", padding: "2px 6px", borderRadius: "4px", color: "var(--primary)", fontSize: "0.8rem" }}>http://YOUR_IP:5000/api/devices/arduino-event</code>
                <br /><br />
                <strong style={{ color: "var(--text)" }}>Event types:</strong> pill_taken, pill_missed, device_offline, low_pills
                <br /><br />
                <code style={{ display: "block", background: "var(--bg)", padding: "10px", borderRadius: "var(--radius)", fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.8 }}>
                  {`{ "eventType": "pill_taken",\n  "deviceName": "Smart Dispenser #1",\n  "medicineId": 1,\n  "pillsRemaining": 13 }`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Devices;