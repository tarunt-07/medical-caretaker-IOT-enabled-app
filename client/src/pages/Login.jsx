import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/branding/BrandLogo";
import { api } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
    };
    try {
      const response = await api.login(payload);
      if (!response.success) {
        alert(response.message || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(response.data));
      const { role } = response.data;
      if (role === "doctor") navigate("/doctor-dashboard");
      else if (role === "caretaker") navigate("/caretaker-dashboard");
      else navigate("/patient-dashboard");
    } catch {
      alert("Server connection failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page medical-bg">
      <div className="auth-wrapper">
        <div className="glass-card auth-info animate-in">
          <BrandLogo size="lg" subtitle="Your connected care platform" />
          <h1>Welcome <span>back</span> to prantar.io</h1>
          <p>Sign in to manage medicines, patients, and connected IoT devices with prantar.io.</p>
          <div className="auth-points">
            <div className="auth-point">
              <span className="auth-point-icon">Doctors</span>
              <div><h4>Doctors</h4><p>Full prescription and patient management access</p></div>
            </div>
            <div className="auth-point">
              <span className="auth-point-icon">Caretakers</span>
              <div><h4>Caretakers</h4><p>Daily logs, medicine tracking and alert management</p></div>
            </div>
            <div className="auth-point">
              <span className="auth-point-icon">Patients</span>
              <div><h4>Patients</h4><p>Read-only access to schedules and health reports</p></div>
            </div>
          </div>
        </div>

        <div className="glass-card auth-card animate-in">
          <h2>Sign In</h2>
          <p>Enter your credentials to continue</p>
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input-wrap">
              <span className="input-icon">Email</span>
              <input name="email" type="email" placeholder="Email address" required />
            </div>
            <div className="input-wrap">
              <span className="input-icon">Pass</span>
              <input name="password" type="password" placeholder="Password" required />
            </div>
            <div className="input-wrap">
              <span className="input-icon">Role</span>
              <select name="role" required>
                <option value="">Select your role</option>
                <option value="doctor">Doctor</option>
                <option value="caretaker">Caretaker</option>
                <option value="patient">Patient</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In ->"}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
