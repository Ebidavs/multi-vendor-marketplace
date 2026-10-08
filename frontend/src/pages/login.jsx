
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { loginUser, setToken } from "../services/api";

import shoppingIllustration from "../assets/web-shopping.svg";
import xiMarketLogo from "../assets/xi-market-logo.png";

import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const token =
        response?.data?.token || response?.token;

      const user =
        response?.data?.user || response?.user;

      if (!token || !user) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      // This login page is exclusively for customers.
      const role = String(
        user.role || ""
      ).toLowerCase();

      if (role !== "customer") {
        throw new Error(
          "This login page is for customers only. Please use your account's designated login page."
        );
      }

      // Save authenticated customer session.
      setToken(token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Notify components that the user has changed.
      window.dispatchEvent(
        new Event("user-updated")
      );

      // Redirect to marketplace after successful login.
      navigate("/products", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-layout">
        {/* LEFT SIDE: MARKETPLACE SHOWCASE */}
        <section
          className="login-showcase"
          aria-label="Xi Market"
        >
          <div
            className="showcase-orb showcase-orb-top"
            aria-hidden="true"
          />

          <div
            className="showcase-orb showcase-orb-bottom"
            aria-hidden="true"
          />

          <div className="showcase-content">
            <p className="showcase-eyebrow">
              YOUR EVERYDAY MARKETPLACE
            </p>

            <h1>
              Good finds.
              <br />
              Great living.
            </h1>

            <p className="showcase-copy">
              Everything you need, all in one market.
            </p>

            <div className="showcase-art">
              <img
                src={shoppingIllustration}
                alt=""
              />
            </div>

            <p className="showcase-footnote">
              Discover more from the sellers you love.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE: LOGIN FORM */}
        <section
          className="login-form-panel"
          aria-labelledby="login-heading"
        >
          <div className="login-card">
            {/* Brand Logo */}
            <div className="login-brand">
              <span className="login-brand-crop">
                <img
                  src={xiMarketLogo}
                  alt="Xi Market"
                />
              </span>
            </div>

            {/* Introduction */}
            <div className="login-intro">
              <p className="login-kicker">
                WELCOME TO XI MARKET
              </p>

              <h2 id="login-heading">
                Welcome Back{" "}
                <span aria-hidden="true">
                  👋
                </span>
              </h2>

              <p className="login-subtitle">
                Sign in to continue shopping.
              </p>
            </div>

            {/* Success message from another page */}
            {location.state?.message && (
              <p
                className="login-success"
                role="status"
              >
                {location.state.message}
              </p>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="forgot-link">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <p
                  className="login-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            {/* Customer Registration */}
            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>

            {/* Account Reactivation */}
            <p className="reactivation-link">
              Account deactivated?{" "}
              <Link to="/reactivate-account">
                Reactivate it
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
