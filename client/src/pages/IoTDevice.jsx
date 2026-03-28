import { useState, useEffect, useCallback } from "react";
import RoleSidebar from "../components/layout/RoleSidebar";
import RoleTopbar from "../components/layout/RoleTopbar";

function IoTDevice() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"doctor","id":1}');
  const sidebarRole = (user.role || "doctor").charAt(0).toUpperCase() + (user.role || "doctor").slice(1);

  const [logs, setLogs] = useState([]);
  const [deviceId, setDeviceId] = useState("DISPENSER_001");
  const [loading, setLoading] = useState(false);
  const [commanding, setCommanding] = useState(false);

  const FALLBACK_LOGS = [
    { id: 1, status: "dispensed", dispensed_at: new Date().toISOString(), medicine_id: 1 },
    { id: 2, status: "missed", dispensed_at: new Date(Date.now() - 3600000).toISOString(), medicine_id: 2 },
  ];

  // ✅ useCallback so it's stable for useEffect dependency
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/iot/status/${deviceId}`);
      const data = await res.json();
      if (data.success) setLogs(data.data);
      else setLogs(FALLBACK_LOGS);
    } catch {
      setLogs(FALLBACK_LOGS);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  // ✅ THE FIX: async wrapper inside useEffect
  useEffect(() => {
    const loadData = async () => {
      await fetchLogs();
    };
    loadData();
  }, [fetchLogs]);

  const sendCommand = async (command) => {
    setCommanding(true);
    try {
      await fetch("/api/iot/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, command })
      });
      alert(`✅ Command "${command}" sent to device!`);
    } catch {
      alert("❌ Failed to send command");
    }
    setCommanding(false);
  };

  const statusColor = { dispensed: "var(--success)", missed: "var(--danger)", error: "var(--warning)" };
  const statusIcon  = { dispensed: "✅", missed: "❌", error: "⚠️" };

  return (
    <div className="dashboard-layout medical-bg">
      <RoleSidebar role={sidebarRole} />
      <main className="main-panel">
        <RoleTopbar name={user.name} role={sidebarRole} alerts={2} pills={4} notifications={3} />

        <div className="page-header">
          <div>
            <div className="page-title">🤖 IoT Dispenser</div>
            <div className="page-subtitle">Smart Medicine Dispenser Control Panel</div>
          </div>
        </div>

        {/* Device Selector */}
        <div className="glass-card" style={{ padding: "20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: "var(--text)" }}>Device ID:</span>
          <input
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--white)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}
          />
          <button className="btn btn-primary" onClick={fetchLogs}>🔄 Refresh</button>
        </div>

        {/* Control Buttons — Doctor only */}
        {user.role === "doctor" && (
          <div className="glass-card" style={{ padding: "20px", marginBottom: "20px" }}>
            <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "14px", color: "var(--text)" }}>🎛️ Device Controls</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => sendCommand("dispense")} disabled={commanding}>
                💊 Dispense Now
              </button>
              <button onClick={() => sendCommand("refill_alert")} disabled={commanding}
                style={{ padding: "10px 20px", borderRadius: "var(--radius)", border: "none", background: "var(--warning)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                🔔 Refill Alert
              </button>
              <button onClick={() => sendCommand("lock")} disabled={commanding}
                style={{ padding: "10px 20px", borderRadius: "var(--radius)", border: "none", background: "var(--danger)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                🔒 Lock Device
              </button>
              <button onClick={() => sendCommand("unlock")} disabled={commanding}
                style={{ padding: "10px 20px", borderRadius: "var(--radius)", border: "none", background: "var(--success)", color: "white", fontWeight: 700, cursor: "pointer" }}>
                🔓 Unlock Device
              </button>
            </div>
          </div>
        )}

        {/* Dispense Logs */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "14px", color: "var(--text)" }}>📋 Dispense Log</div>
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: "30px" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {logs.map(log => (
                <div key={log.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "var(--radius)", background: "var(--bg)", border: `1.5px solid ${statusColor[log.status]}22` }}>
                  <span style={{ fontSize: "1.4rem" }}>{statusIcon[log.status]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>{log.status}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      Medicine #{log.medicine_id} · {new Date(log.dispensed_at).toLocaleString()}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: statusColor[log.status], background: `${statusColor[log.status]}22`, padding: "4px 12px", borderRadius: "999px" }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default IoTDevice;