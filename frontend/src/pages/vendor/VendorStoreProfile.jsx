
import { useEffect, useState } from "react";
import {
  Store,
  Mail,
  Phone,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  createShop,
  getVendorDashboard,
  updateMyShop,
} from "../../services/api";

import "./vendor.css";

const emptyStore = {
  name: "",
  contactEmail: "",
  contactPhone: "",
  description: "",
};

function VendorStoreProfile() {
  const [store, setStore] = useState(emptyStore);
  const [shopExists, setShopExists] = useState(false);
  const [shopActive, setShopActive] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVendorDashboard();
        const shop = response?.data?.shop;

        if (cancelled) return;

        if (!shop) {
          throw new Error("Store information was not returned.");
        }

        setShopExists(true);
        setShopActive(shop.isActive ?? null);

        setStore({
          name: shop.name || "",
          contactEmail: shop.contactEmail || "",
          contactPhone: shop.contactPhone || "",
          description: shop.description || "",
        });
      } catch (err) {
        if (cancelled) return;

        const message = err.message || "Failed to load store profile.";

        if (
          err.status === 404 ||
          message.toLowerCase().includes("registered shop")
        ) {
          setShopExists(false);

          try {
            const user = JSON.parse(
              localStorage.getItem("user") || "null"
            );

            setStore({
              name: user?.businessName || "",
              description: user?.businessDescription || "",
              contactEmail: user?.email || "",
              contactPhone: user?.phoneNumber || "",
            });
          } catch {
            setStore(emptyStore);
          }
        } else {
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStore();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStore((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!store.name.trim()) {
      setError("Please enter your store name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: store.name.trim(),
        description: store.description.trim(),
        contactEmail: store.contactEmail.trim(),
        contactPhone: store.contactPhone.trim(),
      };

      const response = shopExists
        ? await updateMyShop(payload)
        : await createShop(payload);

      const savedShop = response?.data;

      if (savedShop) {
        setStore({
          name: savedShop.name ?? payload.name,
          description:
            savedShop.description ?? payload.description,
          contactEmail:
            savedShop.contactEmail ?? payload.contactEmail,
          contactPhone:
            savedShop.contactPhone ?? payload.contactPhone,
        });

        setShopActive(savedShop.isActive ?? shopActive);
      }

      setShopExists(true);

      setSuccess(
        shopExists
          ? "Store profile updated successfully!"
          : "Store created successfully!"
      );

      window.dispatchEvent(new Event("store-updated"));
    } catch (err) {
      setError(err.message || "Failed to save store profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-store-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Store Profile</h1>
            <p>
              Manage how your store appears to customers.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-panel">
            <p>Loading store profile...</p>
          </div>
        ) : (
          <>
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="store-success-message" role="status">
                {success}
              </p>
            )}

            <form
              className="store-profile-layout"
              onSubmit={handleSubmit}
            >
              <aside className="dashboard-panel store-preview-card">
                <div className="store-logo">
                  <Store size={36} />
                </div>

                <h2>{store.name || "Your Store"}</h2>

                <p>
                  {store.description ||
                    "Add a description for your store."}
                </p>

                <span className="verified-store">
                  {!shopExists
                    ? "New Store"
                    : shopActive === false
                      ? "Inactive Store"
                      : shopActive === true
                        ? "Active Store"
                        : "Vendor Store"}
                </span>
              </aside>

              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Store Information</h2>
                    <p>Update your public store details</p>
                  </div>
                </div>

                <div className="store-form">
                  <div className="form-group">
                    <label htmlFor="store-name">
                      Store Name
                    </label>

                    <div className="input-with-icon">
                      <Store size={17} />
                      <input
                        id="store-name"
                        name="name"
                        value={store.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="store-email">
                      Contact Email
                    </label>

                    <div className="input-with-icon">
                      <Mail size={17} />
                      <input
                        id="store-email"
                        name="contactEmail"
                        type="email"
                        value={store.contactEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="store-phone">
                      Contact Phone
                    </label>

                    <div className="input-with-icon">
                      <Phone size={17} />
                      <input
                        id="store-phone"
                        name="contactPhone"
                        type="tel"
                        value={store.contactPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group store-description">
                    <label htmlFor="store-description">
                      Store Description
                    </label>

                    <textarea
                      id="store-description"
                      name="description"
                      rows="5"
                      value={store.description}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    className="save-store-button"
                    type="submit"
                    disabled={saving || Boolean(error && !shopExists)}
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : shopExists
                        ? "Save Changes"
                        : "Create Store"}
                  </button>
                </div>
              </section>
            </form>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}

export default VendorStoreProfile;
