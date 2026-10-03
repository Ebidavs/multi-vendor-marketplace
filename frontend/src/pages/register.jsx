import { useState } from "react";
import "./register.css";
import { registerUser } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const userData = 
       {...formData }; 
       delete
      userData.confirmPassword;

      const data = await registerUser(userData);

      setMessage(data.message || "Registration successful!");

      setFormData({
        role: "customer",
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <h1>Xi Market</h1>
        </div>

        <h2>Create Account</h2>

        <p className="register-subtitle">
          Create your Xi Market account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {message && <p className="success-message">{message}</p>}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
