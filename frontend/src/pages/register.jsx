import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { registerUser } from "../services/api";
import shoppingIllustration from "../assets/web-shopping.svg";
import xiMarketLogo from "../assets/xi-market-logo.png";

function Register({ role = "customer" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role,
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    businessDescription: "",
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
      navigate(role === "vendor" ? "/login" : "/products");

      setFormData({
        role,
        name: "",
        email: "",
        phoneNumber: "",
        businessName: "",
        businessDescription: "",
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
      <main className="register-layout">
        <section className="register-showcase" aria-label="Xi Market">
          <div className="register-showcase-orb register-showcase-orb-top" aria-hidden="true" />
          <div className="register-showcase-orb register-showcase-orb-bottom" aria-hidden="true" />
          <div className="register-showcase-content">
            <p className="register-eyebrow">A MARKET MADE FOR YOU</p>
            <h1>Find your<br />kind of good.</h1>
            <p className="register-showcase-copy">
              Everything you need, all in one market.
            </p>
            <div className="register-showcase-art">
              <img src={shoppingIllustration} alt="" />
            </div>
            <p className="register-showcase-footnote">
              Shop unique finds from sellers you love.
            </p>
          </div>
        </section>

        <section className="register-form-panel" aria-labelledby="register-heading">
          <div className="register-card">
            <div className="register-brand">
              <span className="register-brand-crop">
                <img src={xiMarketLogo} alt="Xi Market" />
              </span>
            </div>

            <p className="register-kicker">
              {role === "vendor" ? "START SELLING ON XI MARKET" : "YOUR NEXT FAVOURITE THING AWAITS"}
            </p>
            <h2 id="register-heading">
              {role === "vendor" ? "Create Vendor Account" : "Create Account"} <span aria-hidden="true">👋</span>
            </h2>
            <p className="register-subtitle">
              {role === "vendor"
                ? "Set up your seller account and bring your products to Xi Market."
                : "Join Xi Market and discover something wonderful."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="register-field">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {role === "vendor" && (
                <>
                  <div className="register-field">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleChange}
                      minLength={5}
                      required
                    />
                  </div>

                  <div className="register-field">
                    <label htmlFor="businessDescription">Business Description</label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      placeholder="Tell customers about your business"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      minLength={5}
                      required
                    />
                  </div>
                </>
              )}

              <div className="register-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
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
                {loading
                  ? "Creating Account..."
                  : role === "vendor"
                    ? "Create Vendor Account"
                    : "Create Account"}
              </button>
            </form>

            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
