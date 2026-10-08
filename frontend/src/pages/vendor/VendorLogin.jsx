
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  loginUser,
  setToken,
  clearToken,
  getVendorDashboard,
} from "../../services/api";
import "./vendorAuth.css";

function VendorLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    let loginSessionSaved = false;

    try {
      // STEP 1: Authenticate vendor
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error(
          "Login response is missing account information."
        );
      }

      if (user.role !== "vendor") {
        throw new Error(
          "This account is not registered as a vendor."
        );
      }

      // STEP 2: Save vendor session
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      loginSessionSaved = true;

      window.dispatchEvent(new Event("user-updated"));

      // STEP 3: Get the page the vendor originally requested
      const destination = location.state?.from;

      const redirectPath =
        destination?.pathname?.startsWith("/vendor/") &&
        ![
          "/vendor/login",
          "/vendor/register",
          "/vendor/setup",
        ].includes(destination.pathname)
          ? `${destination.pathname}${destination.search || ""}`
          : "/vendor/dashboard";

      // STEP 4: Check whether the vendor has a store
      try {
        await getVendorDashboard();

        // Existing store: go to the requested page
        navigate(redirectPath, {
          replace: true,
        });
      } catch (dashboardError) {
        const message =
          dashboardError.message?.toLowerCase() || "";

        const shopMissing =
          dashboardError.status === 404 ||
          message.includes("registered shop");

        if (shopMissing) {
          // New vendor: complete store setup first
          navigate("/vendor/setup", {
            replace: true,
            state: {
              from: redirectPath,
            },
          });

          return;
        }

        throw dashboardError;
      }
    } catch (err) {
      // Remove the session if login succeeded but
      // the subsequent dashboard check failed
      if (loginSessionSaved) {
        clearToken();
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("user-updated"));
      }

      setError(
        err.message || "Unable to sign in to the Vendor Portal."
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
              Welcome back to your
              <span> Vendor Portal.</span>
            </h1>

            <p>
              Manage your store, products, customer orders
              and business performance from one place.
            </p>

            <div className="vendor-auth-benefits">
              <div>
                <span className="benefit-check">✓</span>
                <p>Manage your product catalogue</p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>Track and fulfil customer orders</p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>Monitor your store performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-auth-form-section">
          <div className="vendor-auth-form-wrapper">
            <div className="vendor-auth-heading">
              <p className="vendor-auth-eyebrow">
                VENDOR PORTAL
              </p>

              <h2>Sign in to your store</h2>

              <p>
                Enter your vendor account details to
                continue to your dashboard.
              </p>
            </div>

            {successMessage && (
              <div className="vendor-auth-success">
                {successMessage}
              </div>
            )}

            {error && (
              <div
                className="vendor-auth-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <form
              className="vendor-auth-form"
              onSubmit={handleSubmit}
            >
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
                  autoComplete="email"
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="vendor-auth-forgot">
                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="vendor-auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In to Vendor Portal"}
              </button>
            </form>

            <p className="vendor-auth-switch">
              Want to start selling?{" "}
              <Link to="/vendor/register">
                Create a vendor account
              </Link>
            </p>

            <p className="vendor-auth-customer-link">
              Shopping on XI Market?{" "}
              <Link to="/login">
                Customer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
