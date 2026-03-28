function AlertCard({ title, text, type = "danger" }) {
  const icons = { danger: "🚨", warning: "⚠️", info: "ℹ️", success: "✅" };
  return (
    <div className={`alert-card ${type} animate-in`}>
      <span className="alert-icon">{icons[type] || "🚨"}</span>
      <div>
        <div className="alert-title">{title}</div>
        <div className="alert-text">{text}</div>
      </div>
    </div>
  );
}
export default AlertCard;