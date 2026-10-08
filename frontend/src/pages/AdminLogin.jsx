
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setToken } from "../services/api";
import "./login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error(
          "Invalid login response from the server."
        );
      }

      if (
        String(user.role).toLowerCase() !== "admin"
      ) {
        throw new Error(
          "Access denied. This login is for administrators only."
        );
      }

      setToken(token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      window.dispatchEvent(
        new Event("user-updated")
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Xi Market</h1>
        </div>

        <h2>Admin Login</h2>

        <p className="login-subtitle">
          Sign in to manage the Xi Market marketplace
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              type="email"
              id="admin-email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              type="password"
              id="admin-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login as Admin"}
          </button>
        </form>

        <p className="register-text">
          Not an administrator?{" "}
          <Link to="/login">
            Customer Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
