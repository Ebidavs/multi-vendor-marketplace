import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShop } from "../../services/api";
import "./vendorAuth.css";

function VendorStoreSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    logo: "",
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
    setLoading(true);

    try {
      const shopData = {
        name: formData.name.trim(),
      };

      if (formData.description.trim()) {
        shopData.description =
          formData.description.trim();
      }

      if (formData.contactEmail.trim()) {
        shopData.contactEmail =
          formData.contactEmail.trim();
      }

      if (formData.contactPhone.trim()) {
        shopData.contactPhone =
          formData.contactPhone.trim();
      }

      if (formData.logo.trim()) {
        shopData.logo = formData.logo.trim();
      }

      await createShop(shopData);

      navigate("/vendor/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your store."
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
              ALMOST THERE
            </span>

            <h1>
              Give your business a
              <span> home on XI Marketplace.</span>
            </h1>

            <p>
              Set up your store profile before entering your
              vendor dashboard. Customers will use this
              information to identify your business.
            </p>

            <div className="vendor-auth-benefits">
              <div>
                <span className="benefit-check">✓</span>
                <p>Build your store identity</p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>Showcase products under your business</p>
              </div>

              <div>
                <span className="benefit-check">✓</span>
                <p>Manage everything from your dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-auth-form-section">
          <div className="vendor-auth-form-wrapper">
            <div className="vendor-auth-heading">
              <p className="vendor-auth-eyebrow">
                STORE SETUP
              </p>

              <h2>Set up your store</h2>

              <p>
                Tell customers a little about your business.
                You can update these details later.
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
                  Store Name *
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  maxLength="100"
                  placeholder="e.g. Davidson Electronics"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="description">
                  Store Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell customers about your store and what you sell"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="contactEmail">
                  Business Email
                </label>

                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  placeholder="Business contact email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="contactPhone">
                  Business Phone
                </label>

                <input
                  id="contactPhone"
                  type="tel"
                  name="contactPhone"
                  placeholder="Business contact number"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="vendor-auth-field">
                <label htmlFor="logo">
                  Store Logo URL
                  <span className="vendor-optional">
                    {" "}— optional
                  </span>
                </label>

                <input
                  id="logo"
                  type="url"
                  name="logo"
                  placeholder="https://example.com/logo.jpg"
                  value={formData.logo}
                  onChange={handleChange}
                />

                <small className="vendor-auth-hint">
                  You can leave this empty and add your logo
                  later from your store profile.
                </small>
              </div>

              <button
                type="submit"
                className="vendor-auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Store..."
                  : "Create Store & Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorStoreSetup;