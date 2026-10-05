import { useState } from "react";
import {
  Bell,
  Lock,
  Store,
  ShieldCheck,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorSettings() {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    reviews: true,
    promotions: false,
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (
      password.newPassword !==
      password.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password updated successfully!");
  };

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-settings-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Settings</h1>
            <p>
              Manage your vendor account preferences,
              notifications and security.
            </p>
          </div>
        </div>

        <div className="settings-layout">
          <div className="settings-main">
            <section className="dashboard-panel settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Bell size={20} />
                </div>

                <div>
                  <h2>Notifications</h2>
                  <p>
                    Choose the notifications you want to
                    receive.
                  </p>
                </div>
              </div>

              <div className="settings-options">
                <SettingToggle
                  title="New Orders"
                  description="Receive notifications when a customer places a new order."
                  checked={notifications.newOrders}
                  onChange={() =>
                    handleNotificationChange(
                      "newOrders"
                    )
                  }
                />

                <SettingToggle
                  title="Order Updates"
                  description="Receive notifications about changes to your orders."
                  checked={notifications.orderUpdates}
                  onChange={() =>
                    handleNotificationChange(
                      "orderUpdates"
                    )
                  }
                />

                <SettingToggle
                  title="Customer Reviews"
                  description="Get notified whenever a customer reviews your product."
                  checked={notifications.reviews}
                  onChange={() =>
                    handleNotificationChange("reviews")
                  }
                />

                <SettingToggle
                  title="Marketing & Promotions"
                  description="Receive marketplace news and promotional updates."
                  checked={notifications.promotions}
                  onChange={() =>
                    handleNotificationChange(
                      "promotions"
                    )
                  }
                />
              </div>
            </section>

            <section className="dashboard-panel settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon security">
                  <Lock size={20} />
                </div>

                <div>
                  <h2>Password & Security</h2>
                  <p>
                    Keep your MarketHub vendor account
                    secure.
                  </p>
                </div>
              </div>

              <form
                className="password-settings-form"
                onSubmit={handlePasswordSubmit}
              >
                <div className="form-group">
                  <label>Current Password</label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="password-form-grid">
                  <div className="form-group">
                    <label>New Password</label>

                    <input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  className="settings-save-button"
                  type="submit"
                >
                  <Save size={16} />
                  Update Password
                </button>
              </form>
            </section>
          </div>

          <aside className="settings-sidebar">
            <section className="settings-security-card">
              <div className="settings-security-icon">
                <ShieldCheck size={30} />
              </div>

              <h3>Account Security</h3>

              <p>
                Your vendor account is currently protected
                and in good standing.
              </p>

              <div className="security-status">
                <span></span>
                Account Secure
              </div>
            </section>

            <section className="dashboard-panel settings-store-card">
              <Store size={22} />

              <div>
                <span>Store Account</span>
                <strong>TechHub Store</strong>
                <small>Verified Vendor</small>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="setting-toggle-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle-switch ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
      >
        <span></span>
      </button>
    </div>
  );
}

export default VendorSettings;