import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorStoreProfile() {
  const [store, setStore] = useState({
    name: "TechHub Store",
    email: "techhub@markethub.com",
    phone: "+234 801 234 5678",
    location: "Port Harcourt, Nigeria",
    description:
      "Quality electronics and accessories at affordable prices.",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStore((previousStore) => ({
      ...previousStore,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    alert("Store profile updated successfully!");
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

        <form
          className="store-profile-layout"
          onSubmit={handleSubmit}
        >
          <aside className="dashboard-panel store-preview-card">
            <div className="store-logo">
              <Store size={36} />
            </div>

            <h2>{store.name}</h2>

            <p>{store.description}</p>

            <span className="verified-store">
              Verified Vendor
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
                <label>Store Name</label>

                <div className="input-with-icon">
                  <Store size={17} />

                  <input
                    name="name"
                    value={store.name}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>

                <div className="input-with-icon">
                  <MapPin size={17} />

                  <input
                    name="location"
                    value={store.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group store-description">
                <label>Store Description</label>

                <textarea
                  name="description"
                  rows="5"
                  value={store.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                className="save-store-button"
                type="submit"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </section>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default VendorStoreProfile;