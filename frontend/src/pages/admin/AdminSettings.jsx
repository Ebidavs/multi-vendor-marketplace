import { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Store,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminSettings() {
  const [settings, setSettings] = useState({
    vendorApproval: true,
    orderNotifications: true,
    newUserNotifications: false,
    productReports: true,
  });

  const [marketplace, setMarketplace] = useState({
    name: "MarketHub",
    email: "admin@markethub.com",
    supportEmail: "support@markethub.com",
    currency: "NGN",
  });

  const toggleSetting = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handleMarketplaceChange = (event) => {
    const { name, value } = event.target;

    setMarketplace((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveSettings = (event) => {
    event.preventDefault();
    alert("Marketplace settings saved!");
  };

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Admin Settings</h1>
            <p>
              Configure marketplace information, notifications and
              administrative preferences.
            </p>
          </div>
        </div>

        <div className="admin-settings-layout">
          <div className="admin-settings-main">
            <section className="admin-settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Store size={19} />
                </div>

                <div>
                  <h2>Marketplace Information</h2>
                  <p>Manage basic MarketHub configuration.</p>
                </div>
              </div>

              <form onSubmit={saveSettings}>
                <div className="admin-form-grid">
                  <label>
                    Marketplace Name

                    <input
                      name="name"
                      value={marketplace.name}
                      onChange={handleMarketplaceChange}
                    />
                  </label>

                  <label>
                    Admin Email

                    <input
                      type="email"
                      name="email"
                      value={marketplace.email}
                      onChange={handleMarketplaceChange}
                    />
                  </label>

                  <label>
                    Support Email

                    <input
                      type="email"
                      name="supportEmail"
                      value={marketplace.supportEmail}
                      onChange={handleMarketplaceChange}
                    />
                  </label>

                  <label>
                    Currency

                    <select
                      name="currency"
                      value={marketplace.currency}
                      onChange={handleMarketplaceChange}
                    >
                      <option value="NGN">
                        Nigerian Naira (₦)
                      </option>
                    </select>
                  </label>
                </div>

                <button className="admin-save-button">
                  <Save size={16} />
                  Save Changes
                </button>
              </form>
            </section>

            <section className="admin-settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Bell size={19} />
                </div>

                <div>
                  <h2>Admin Notifications</h2>
                  <p>
                    Choose the marketplace activity you want to
                    monitor.
                  </p>
                </div>
              </div>

              <SettingToggle
                title="Vendor Approval Requests"
                description="Receive alerts when a new vendor requests approval."
                enabled={settings.vendorApproval}
                onClick={() => toggleSetting("vendorApproval")}
              />

              <SettingToggle
                title="Order Notifications"
                description="Receive alerts for important marketplace orders."
                enabled={settings.orderNotifications}
                onClick={() => toggleSetting("orderNotifications")}
              />

              <SettingToggle
                title="New User Registrations"
                description="Receive notifications when customers register."
                enabled={settings.newUserNotifications}
                onClick={() => toggleSetting("newUserNotifications")}
              />

              <SettingToggle
                title="Product Reports"
                description="Receive alerts when a product is reported."
                enabled={settings.productReports}
                onClick={() => toggleSetting("productReports")}
              />
            </section>
          </div>

          <aside className="admin-security-card">
            <div className="admin-security-icon">
              <ShieldCheck size={27} />
            </div>

            <span>ADMIN CONTROL</span>

            <h2>Marketplace Security</h2>

            <p>
              Administrative actions affect vendors, customers,
              products and orders across MarketHub.
            </p>

            <div className="security-status">
              <span></span>
              System Protected
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
  enabled,
  onClick,
}) {
  return (
    <div className="admin-setting-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`settings-toggle ${enabled ? "enabled" : ""}`}
        onClick={onClick}
      >
        <span></span>
      </button>
    </div>
  );
}

export default AdminSettings;