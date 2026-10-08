
import { useEffect, useState } from "react";
import {
  Bell,
  Lock,
  Store,
  ShieldCheck,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  changeMyPassword,
  getVendorDashboard,
  getMyProfile,
} from "../../services/api";

import "./vendor.css";

const defaultNotifications = {
  newOrders: true,
  orderUpdates: true,
  reviews: true,
  promotions: false,
};

const emptyPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function VendorSettings() {
  const [notifications, setNotifications] = useState(
    defaultNotifications
  );

  const [password, setPassword] = useState(emptyPassword);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [storeName, setStoreName] = useState("");
  const [storeStatus, setStoreStatus] = useState("");
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState("");

  const [notificationMessage, setNotificationMessage] =
    useState("");

  const [notificationKey, setNotificationKey] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const profileResponse = await getMyProfile();
        const user = profileResponse?.data;

        if (cancelled) return;

        const userId = user?._id || user?.id;

        if (userId) {
          const key = `vendor-notifications-${userId}`;
          setNotificationKey(key);

          const saved = localStorage.getItem(key);

          if (saved) {
            try {
              setNotifications({
                ...defaultNotifications,
                ...JSON.parse(saved),
              });
            } catch {
              setNotifications(defaultNotifications);
            }
          }
        }

        try {
          const dashboardResponse =
            await getVendorDashboard();

          if (cancelled) return;

          const shop = dashboardResponse?.data?.shop;

          if (shop) {
            setStoreName(shop.name || "Your Store");
            setStoreStatus(
              shop.isActive === false
                ? "Inactive Store"
                : shop.isActive === true
                  ? "Active Store"
                  : "Vendor Store"
            );
          } else {
            setStoreName(user?.businessName || "No Store");
            setStoreStatus("Store Not Available");
          }
        } catch (err) {
          if (cancelled) return;

          if (
            err.status === 404 ||
            err.message?.toLowerCase().includes(
              "registered shop"
            )
          ) {
            setStoreName(user?.businessName || "No Store");
            setStoreStatus("Store Not Created");
          } else {
            setStoreError(
              err.message || "Unable to load store details."
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStoreError(
            err.message || "Unable to load account details."
          );
        }
      } finally {
        if (!cancelled) setStoreLoading(false);
      }
    };

    loadSettings();

    const refreshStore = () => {
      getVendorDashboard()
        .then((response) => {
          if (cancelled) return;

          const shop = response?.data?.shop;

          if (shop) {
            setStoreName(shop.name || "Your Store");
            setStoreStatus(
              shop.isActive === false
                ? "Inactive Store"
                : shop.isActive === true
                  ? "Active Store"
                  : "Vendor Store"
            );
            setStoreError("");
          }
        })
        .catch(() => {
          // The page will retry when it is reopened.
        });
    };

    window.addEventListener("store-updated", refreshStore);

    return () => {
      cancelled = true;
      window.removeEventListener(
        "store-updated",
        refreshStore
      );
    };
  }, []);

  const handleNotificationChange = (name) => {
    setNotifications((previous) => {
      const updated = {
        ...previous,
        [name]: !previous[name],
      };

      if (notificationKey) {
        localStorage.setItem(
          notificationKey,
          JSON.stringify(updated)
        );

        setNotificationMessage("Preferences saved.");
      } else {
        setNotificationMessage(
          "Preferences changed for this session only."
        );
      }

      return updated;
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (
      password.newPassword.length < 8 ||
      !/[a-z]/.test(password.newPassword) ||
      !/[A-Z]/.test(password.newPassword) ||
      !/[0-9]/.test(password.newPassword) ||
      !/[^A-Za-z0-9]/.test(password.newPassword)
    ) {
      setPasswordError(
        "Your new password must contain at least 8 characters, including uppercase, lowercase, a number and a special character."
      );
      return;
    }

    if (password.currentPassword === password.newPassword) {
      setPasswordError(
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await changeMyPassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });

      setPassword(emptyPassword);
      setPasswordSuccess("Password updated successfully!");
    } catch (err) {
      setPasswordError(
        err.message || "Unable to update your password."
      );
    } finally {
      setPasswordLoading(false);
    }
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
                    handleNotificationChange("newOrders")
                  }
                />

                <SettingToggle
                  title="Order Updates"
                  description="Receive notifications about changes to your orders."
                  checked={notifications.orderUpdates}
                  onChange={() =>
                    handleNotificationChange("orderUpdates")
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
                    handleNotificationChange("promotions")
                  }
                />
              </div>

              {notificationMessage && (
                <p
                  className="store-success-message"
                  role="status"
                >
                  {notificationMessage}
                </p>
              )}
            </section>

            <section className="dashboard-panel settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon security">
                  <Lock size={20} />
                </div>

                <div>
                  <h2>Password & Security</h2>
                  <p>
                    Keep your XI Marketplace vendor
                    account secure.
                  </p>
                </div>
              </div>

              {passwordError && (
                <p className="login-error" role="alert">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p
                  className="store-success-message"
                  role="status"
                >
                  {passwordSuccess}
                </p>
              )}

              <form
                className="password-settings-form"
                onSubmit={handlePasswordSubmit}
              >
                <div className="form-group">
                  <label htmlFor="current-password">
                    Current Password
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="password-form-grid">
                  <div className="form-group">
                    <label htmlFor="new-password">
                      New Password
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-password">
                      Confirm New Password
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <button
                  className="settings-save-button"
                  type="submit"
                  disabled={passwordLoading}
                >
                  <Save size={16} />
                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}
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
                Manage your password to help protect your
                vendor account.
              </p>

              <div className="security-status">
                <span></span>
                Password Protection
              </div>
            </section>

            <section className="dashboard-panel settings-store-card">
              <Store size={22} />

              <div>
                <span>Store Account</span>

                <strong>
                  {storeLoading
                    ? "Loading store..."
                    : storeName || "Store Unavailable"}
                </strong>

                <small>
                  {storeLoading
                    ? "Checking store status..."
                    : storeError || storeStatus}
                </small>
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
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${title}`}
      >
        <span></span>
      </button>
    </div>
  );
}

export default VendorSettings;
