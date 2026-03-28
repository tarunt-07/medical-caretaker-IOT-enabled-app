import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/branding/BrandLogo";
import { api } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value,
    };
    try {
      const response = await api.signup(payload);
      if (!response.success) {
        alert(response.message || "Signup failed");
        setLoading(false);
        return;
      }
      alert("Account created! Please login.");
      navigate("/login");
    } catch {
      alert("Server connection failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page medical-bg">
      <div className="auth-wrapper">
        <div className="glass-card auth-info animate-in">
          <BrandLogo size="lg" subtitle="Create your care access" />
          <h1>Join <span>prantar.io</span> Today</h1>
          <p>Create your account and get access to the connected healthcare experience built on prantar.io.</p>
          <div className="auth-points">
            <div className="auth-point">
              <span className="auth-point-icon">IoT</span>
              <div><h4>IoT Connected</h4><p>Link Arduino and Raspberry Pi smart dispensers</p></div>
            </div>
            <div className="auth-point">
              <span className="auth-point-icon">Alerts</span>
              <div><h4>Smart Alerts</h4><p>Missed pill and device offline notifications</p></div>
            </div>
            <div className="auth-point">
              <span className="auth-point-icon">Stats</span>
              <div><h4>Analytics</h4><p>Recovery charts and medicine adherence tracking</p></div>
            </div>
          </div>
        </div>

        <div className="glass-card auth-card animate-in">
          <h2>Create Account</h2>
          <p>Fill in your details to get started</p>
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input-wrap">
              <span className="input-icon">Name</span>
              <input name="name" type="text" placeholder="Full name" required />
            </div>
            <div className="input-wrap">
              <span className="input-icon">Email</span>
              <input name="email" type="email" placeholder="Email address" required />
            </div>
            <div className="input-wrap">
              <span className="input-icon">Phone</span>
              <input name="phone" type="tel" placeholder="Phone number" />
            </div>
            <div className="input-wrap">
              <span className="input-icon">Pass</span>
              <input name="password" type="password" placeholder="Create password" required />
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
              {loading ? "Creating..." : "Create Account ->"}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
