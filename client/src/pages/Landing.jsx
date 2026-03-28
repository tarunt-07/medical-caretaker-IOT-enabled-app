import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page medical-bg">
      <section className="hero-left">
        <div className="hero-badge">Smart Connected Medical Care</div>
        <h1 className="hero-title">
          Your Complete <span>prantar.io</span> Platform
        </h1>
        <p className="hero-subtitle">
          Manage medicines, patient condition, reports, appointments, IoT-connected
          dispenser devices and day-to-day healthcare tracking in one modern platform.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">🔐 Login</Link>
          <Link to="/signup" className="btn btn-teal">✨ Get Started</Link>
          <Link to="/caretaker-dashboard" className="btn btn-outline">👁️ View Demo</Link>
        </div>
        <div className="feature-strip">
          <div className="feature-mini animate-in">
            <div className="icon">💊</div>
            <h4>Medicine Tracking</h4>
            <p>Pending doses, missed pills, dosage timing and adherence records.</p>
          </div>
          <div className="feature-mini animate-in">
            <div className="icon">🩺</div>
            <h4>Doctor Control</h4>
            <p>Prescription management, report review and medical approvals.</p>
          </div>
          <div className="feature-mini animate-in">
            <div className="icon">📡</div>
            <h4>IoT Integration</h4>
            <p>Connect Arduino, ESP32 or Raspberry Pi smart dispensers live.</p>
          </div>
        </div>
      </section>

      <section className="hero-right">
        <div className="glass-card medical-panel animate-in">
          <h2 className="panel-title">Role-Based Access for prantar.io</h2>
          <p className="panel-subtitle">Choose your role to access the right tools</p>
          <div className="role-grid">
            <Link to="/login" className="role-card">
              <span className="role-icon">🩺</span>
              <div>
                <h3>Doctor</h3>
                <p>Full access to prescriptions, reports, approvals, patient monitoring and care decisions.</p>
              </div>
            </Link>
            <Link to="/login" className="role-card">
              <span className="role-icon">🧑‍⚕️</span>
              <div>
                <h3>Caretaker</h3>
                <p>Daily logs, medicine updates, symptom observations and doctor coordination.</p>
              </div>
            </Link>
            <Link to="/login" className="role-card">
              <span className="role-icon">🙋</span>
              <div>
                <h3>Patient</h3>
                <p>View medicine schedule, reports, appointments and health status alerts.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
