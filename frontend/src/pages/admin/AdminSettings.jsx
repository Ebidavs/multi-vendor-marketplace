
import { useEffect, useState } from "react";
import {
  Bell,
  ShieldCheck,
  Store,
  RefreshCw,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  getMyProfile,
} from "../../services/api";

import "./admin.css";

const notificationOptions = [
  {
    id: "vendorApproval",
    title: "Vendor Approval Requests",
    description:
      "Receive alerts when a new vendor requests approval.",
  },
  {
    id: "orderNotifications",
    title: "Order Notifications",
    description:
      "Receive alerts for important marketplace orders.",
  },
  {
    id: "newUserNotifications",
    title: "New User Registrations",
    description:
      "Receive notifications when customers register.",
  },
  {
    id: "productReports",
    title: "Product Reports",
    description:
      "Receive alerts when a product is reported.",
  },
];

function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();

        if (cancelled) return;

        const data = response?.data || response;
        const user = data?.user || data;

        if (!user || typeof user !== "object") {
          throw new Error(
            "Invalid profile response from server."
          );
        }

        setAdmin(user);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load admin profile:",
          err
        );

        setError(
          err.message ||
            "Unable to load administrator profile."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Admin Settings</h1>
            <p>
              View marketplace information,
              notifications and administrative
              preferences.
            </p>
          </div>
        </div>

        {error && (
          <p
            className="login-error"
            role="alert"
            style={{ marginBottom: "20px" }}
          >
            {error}
          </p>
        )}

        <div className="admin-settings-layout">
          <div className="admin-settings-main">
            <section className="admin-settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Store size={19} />
                </div>

                <div>
                  <h2>Marketplace Information</h2>
                  <p>
                    Current Xi Market configuration.
                  </p>
                </div>
              </div>

              <div className="admin-form-grid">
                <label>
                  Marketplace Name

                  <input
                    type="text"
                    value="Xi Market"
                    readOnly
                  />
                </label>

                <label>
                  Admin Email

                  <input
                    type="email"
                    value={
                      loading
                        ? ""
                        : admin?.email || ""
                    }
                    placeholder={
                      loading
                        ? "Loading..."
                        : "Unavailable"
                    }
                    readOnly
                  />
                </label>

                <label>
                  Support Email

                  <input
                    type="email"
                    value=""
                    placeholder="Not configured"
                    readOnly
                  />
                </label>

                <label>
                  Currency

                  <select
                    value="NGN"
                    disabled
                    onChange={() => {}}
                  >
                    <option value="NGN">
                      Nigerian Naira (₦)
                    </option>
                  </select>
                </label>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.7,
                  marginTop: "15px",
                }}
              >
                Marketplace-wide configuration
                cannot be changed until the backend
                provides a settings endpoint.
              </p>
            </section>

            <section className="admin-settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2>Administrator Account</h2>
                  <p>
                    Information associated with your
                    authenticated account.
                  </p>
                </div>
              </div>

              <div className="admin-form-grid">
                <label>
                  Full Name

                  <input
                    type="text"
                    value={
                      loading
                        ? ""
                        : admin?.name || ""
                    }
                    placeholder={
                      loading
                        ? "Loading..."
                        : "Unavailable"
                    }
                    readOnly
                  />
                </label>

                <label>
                  Account Role

                  <input
                    type="text"
                    value={
                      loading
                        ? ""
                        : admin?.role || ""
                    }
                    placeholder={
                      loading
                        ? "Loading..."
                        : "Unavailable"
                    }
                    readOnly
                  />
                </label>
              </div>

              <button
                type="button"
                className="admin-save-button"
                disabled={loading}
                onClick={() =>
                  setRefreshKey((previous) => previous + 1)
                }
              >
                <RefreshCw size={16} />
                Refresh Profile
              </button>
            </section>

            <section className="admin-settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Bell size={19} />
                </div>

                <div>
                  <h2>Admin Notifications</h2>
                  <p>
                    Notification preferences are
                    awaiting backend integration.
                  </p>
                </div>
              </div>

              {notificationOptions.map((option) => (
                <SettingToggle
                  key={option.id}
                  title={option.title}
                  description={option.description}
                />
              ))}

              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.7,
                  marginTop: "15px",
                }}
              >
                Notification controls will become
                available when notification settings
                are supported by the backend.
              </p>
            </section>
          </div>

          <aside className="admin-security-card">
            <div className="admin-security-icon">
              <ShieldCheck size={27} />
            </div>

            <span>ADMIN CONTROL</span>

            <h2>Marketplace Security</h2>

            <p>
              Administrative actions affect vendors,
              customers, products and orders across
              Xi Market.
            </p>

            <div className="security-status">
              <span></span>
              {admin?.role === "admin"
                ? "Admin Account Verified"
                : "Verification Unavailable"}
            </div>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}

function SettingToggle({
  title,
  description,
}) {
  return (
    <div className="admin-setting-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className="settings-toggle"
        disabled
        aria-label={`${title} — unavailable`}
        aria-pressed={false}
        title="Backend integration required"
      >
        <span></span>
      </button>
    </div>
  );
}

export default AdminSettings;
