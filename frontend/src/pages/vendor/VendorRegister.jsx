import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import "./vendorAuth.css";

function VendorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "vendor",
    name: "",
    businessName: "",
    businessDescription: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      const userData = {
        role: "vendor",
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        businessDescription:
          formData.businessDescription.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      };

      await registerUser(userData);

      navigate("/vendor/login", {
        state: {
          message:
            "Vendor account created successfully. Sign in to continue.",
        },
      });
    } catch (err) {
      setError(
        err.message || "Vendor registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-auth-page">
      <div className="vendor-auth-container">
        <div className="vendor-auth-info">
          <div className="vendor-auth-info-content">
            <span className="vendor-auth-badge">
              XI MARKETPLACE FOR SELLERS
            </span>

            <h1>
              Grow your business with
              <span> XI Marketplace.</span>
            </h1>

            <p>
              Create your vendor account, showcase your
              products, manage orders and reach more
              customers through one marketplace.
            </p>

            <div className="vendor-auth-benefits">
              <div>
                <span className="benefit-check">✓</span>
                <p>
                  Manage your products from one dashboard
                </p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>
                  Receive and manage customer orders
                </p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>
                  Track your store performance and growth
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-auth-form-section">
          <div className="vendor-auth-form-wrapper">
            <div className="vendor-auth-heading">
              <p className="vendor-auth-eyebrow">
                BECOME A SELLER
              </p>

              <h2>Create your vendor account</h2>

              <p>
                Tell us about yourself and your business to
                start selling on XI Marketplace.
              </p>
            </div>

            {error && (
              <div className="vendor-auth-error">
                {error}
              </div>
            )}

            <form
              className="vendor-auth-form"
              onSubmit={handleSubmit}
            >
              <div className="vendor-auth-field">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength="2"
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="businessName">
                  Business Name
                </label>

                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  placeholder="e.g. Davidson Electronics"
                  value={formData.businessName}
                  onChange={handleChange}
                  minLength="5"
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="businessDescription">
                  Business Description
                </label>

                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  placeholder="Tell us briefly about your business and what you sell"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  minLength="5"
                  rows="4"
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="phoneNumber">
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="e.g. 08012345678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vendor-auth-password-row">
                <div className="vendor-auth-field">
                  <label htmlFor="password">
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    required
                  />
                </div>

                <div className="vendor-auth-field">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="8"
                    required
                  />
                </div>
              </div>

              <p className="vendor-auth-hint">
                Password must contain at least 8 characters,
                including an uppercase letter, lowercase
                letter, number and special character.
              </p>

              <button
                type="submit"
                className="vendor-auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Vendor Account..."
                  : "Create Vendor Account"}
              </button>
            </form>

            <p className="vendor-auth-switch">
              Already selling on XI Marketplace?{" "}
              <Link to="/vendor/login">
                Sign in to your Vendor Portal
              </Link>
            </p>

            <p className="vendor-auth-customer-link">
              Shopping instead?{" "}
              <Link to="/register">
                Create a customer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;