
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

import shoppingIllustration from "../assets/web-shopping.svg";
import xiMarketLogo from "../assets/xi-market-logo.png";

import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Customer registration only.
      const userData = {
        role: "customer",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      };

      await registerUser(userData);

      // Registration does not automatically log in the user.
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful! Please log in to continue.",
        },
      });
    } catch (err) {
      setError(
        err.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <main className="register-layout">
        {/* LEFT SIDE: SHOWCASE */}
        <section
          className="register-showcase"
          aria-label="Xi Market"
        >
          <div
            className="register-showcase-orb register-showcase-orb-top"
            aria-hidden="true"
          />

          <div
            className="register-showcase-orb register-showcase-orb-bottom"
            aria-hidden="true"
          />

          <div className="register-showcase-content">
            <p className="register-eyebrow">
              A MARKET MADE FOR YOU
            </p>

            <h1>
              Find your
              <br />
              kind of good.
            </h1>

            <p className="register-showcase-copy">
              Everything you need, all in one market.
            </p>

            <div className="register-showcase-art">
              <img
                src={shoppingIllustration}
                alt=""
              />
            </div>

            <p className="register-showcase-footnote">
              Shop unique finds from sellers you love.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <section
          className="register-form-panel"
          aria-labelledby="register-heading"
        >
          <div className="register-card">
            {/* Brand Logo */}
            <div className="register-brand">
              <span className="register-brand-crop">
                <img
                  src={xiMarketLogo}
                  alt="Xi Market"
                />
              </span>
            </div>

            {/* Introduction */}
            <p className="register-kicker">
              YOUR NEXT FAVOURITE THING AWAITS
            </p>

            <h2 id="register-heading">
              Create Account{" "}
              <span aria-hidden="true">👋</span>
            </h2>

            <p className="register-subtitle">
              Join Xi Market and discover something wonderful.
            </p>

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <div className="register-field">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="phoneNumber">
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <p
                  className="error-message"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
