import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function RoleTopbar({ name, role, alerts = 0, pills = 0, notifications = 0 }) {
  const [avatar, setAvatar] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return storedUser.avatar || null;
  });
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextAvatar = typeof reader.result === "string" ? reader.result : null;
      if (!nextAvatar) return;

      setAvatar(nextAvatar);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: storedUser.name || name,
          role: storedUser.role || role?.toLowerCase(),
          avatar: nextAvatar,
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const roleClass = role?.toLowerCase();

  return (
    <div className="topbar glass-card">
      <div className="topbar-left">
        <div className="topbar-avatar-wrap">
          {avatar
            ? <img className="topbar-avatar topbar-avatar-image" src={avatar} alt={`${name} avatar`} />
            : <div className="topbar-avatar">{initials}</div>
          }
          <div className="avatar-upload-btn" onClick={() => fileRef.current.click()}>✏️</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>
        <div className="topbar-info">
          <h3>{name}</h3>
          <span className={`role-badge ${roleClass}`}>{role}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="stat-chip">
          <span className="stat-chip-icon">💊</span>
          <div>
            <div className="stat-chip-label">Pending Pills</div>
            <div className="stat-chip-value">{pills}</div>
          </div>
        </div>
        <div className="stat-chip">
          <span className="stat-chip-icon">⚠️</span>
          <div>
            <div className="stat-chip-label">Alerts</div>
            <div className="stat-chip-value">{alerts}</div>
          </div>
        </div>
        <Link to="/notifications" className="notif-btn">
          🔔
          {notifications > 0 && <span className="notif-badge">{notifications}</span>}
        </Link>
        <Link to="/profile" className="notif-btn">👤</Link>
      </div>
    </div>
  );
}

export default RoleTopbar;
