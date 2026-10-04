import {
  useEffect,
  useState,
} from "react";

import {
  Store,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  createShop,
  getVendorDashboard,
  updateMyShop,
} from "../../services/api";

import "./vendor.css";

function VendorStoreProfile() {
  const [store, setStore] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  });

  const [shopExists, setShopExists] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const loadStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getVendorDashboard();

        const shop =
          response.data?.shop;

        if (shop) {
          setShopExists(true);

          setStore({
            name:
              shop.name ||
              shop.shopName ||
              "",

            email:
              shop.email || "",

            phone:
              shop.phone || "",

            location:
              shop.location || "",

            description:
              shop.description || "",
          });
        }
      } catch (err) {
        console.error(
          "Load store error:",
          err
        );

        setError(
          err.message ||
            "Failed to load store profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setStore((previousStore) => ({
      ...previousStore,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!store.name.trim()) {
      setError(
        "Please enter your store name."
      );

      return;
    }

    try {
      setSaving(true);

      let response;

      if (shopExists) {
        response =
          await updateMyShop(store);

        setSuccess(
          "Store profile updated successfully!"
        );
      } else {
        response =
          await createShop(store);

        setShopExists(true);

        setSuccess(
          "Store created successfully!"
        );
      }

      console.log(
        "Store saved:",
        response
      );
    } catch (err) {
      console.error(
        "Save store error:",
        err
      );

      setError(
        err.message ||
          "Failed to save store profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="vendor">
        <section className="vendor-store-page">
          <div className="dashboard-panel">
            <p>
              Loading store profile...
            </p>
          </div>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-store-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Store Profile</h1>

            <p>
              Manage how your store
              appears to customers.
            </p>
          </div>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {success && (
          <p className="store-success-message">
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

            <h2>
              {store.name ||
                "Your Store"}
            </h2>

            <p>
              {store.description ||
                "Add a description for your store."}
            </p>

            <span className="verified-store">
              {shopExists
                ? "Vendor Store"
                : "New Store"}
            </span>
          </aside>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Store Information
                </h2>

                <p>
                  Update your public
                  store details
                </p>
              </div>
            </div>

            <div className="store-form">
              <div className="form-group">
                <label>
                  Store Name
                </label>

                <div className="input-with-icon">
                  <Store size={17} />

                  <input
                    name="name"
                    value={store.name}
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>

                <div className="input-with-icon">
                  <Mail size={17} />

                  <input
                    name="email"
                    type="email"
                    value={store.email}
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>

                <div className="input-with-icon">
                  <Phone size={17} />

                  <input
                    name="phone"
                    value={store.phone}
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Location
                </label>

                <div className="input-with-icon">
                  <MapPin size={17} />

                  <input
                    name="location"
                    value={
                      store.location
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </div>

              <div className="form-group store-description">
                <label>
                  Store Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={
                    store.description
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <button
                className="save-store-button"
                type="submit"
                disabled={saving}
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
      </section>
    </DashboardLayout>
  );
}

export default VendorStoreProfile;