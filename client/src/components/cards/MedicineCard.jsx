function MedicineCard({ name, dosage, time, status }) {
  const statusClass = status?.toLowerCase() || "pending";
  const icons = { taken: "✅", pending: "⏳", missed: "❌" };
  return (
    <div className="medicine-card animate-in">
      <div className="medicine-icon">💊</div>
      <div className="medicine-info">
        <div className="medicine-name">{name}</div>
        <div className="medicine-meta">{dosage} · {time}</div>
      </div>
      <span className={`status-pill ${statusClass}`}>{icons[statusClass] || "⏳"} {status}</span>
    </div>
  );
}
export default MedicineCard;