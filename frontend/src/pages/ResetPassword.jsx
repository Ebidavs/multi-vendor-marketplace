import { useState } from "react";
import { Link } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Your password has been reset successfully.");
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <div className="reset-brand">
          <h1>Marketplace</h1>
        </div>

        <h2>Reset password</h2>
        <p className="reset-subtitle">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="reset-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="reset-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="reset-message reset-error">{error}</p>}
          {success && <p className="reset-message reset-success">{success}</p>}

          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>

        <p className="reset-login-link">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
