function Topbar() {
  return (
    <div className="topbar glass-card">
      <div className="topbar-left">
        <img
          className="avatar"
          src="https://via.placeholder.com/100"
          alt="profile"
        />
        <div>
          <h3>Tarun Kumar</h3>
          <span className="role-badge">Caretaker</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="stat-card">
          <h4>Notifications</h4>
          <p>7</p>
        </div>
        <div className="stat-card">
          <h4>Latest Alerts</h4>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h4>Pending Pills</h4>
          <p>5</p>
        </div>
      </div>
    </div>
  );
}

export default Topbar;