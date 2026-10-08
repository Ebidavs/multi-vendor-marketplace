
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  Save,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  getMyProfile,
  updateMyProfile,
} from "../../services/api";

import "./vendor.css";

const initialProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  businessName: "",
  businessDescription: "",
};

function VendorPersonalProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();
        const user = response?.data;

        if (!user) {
          throw new Error("Profile information was not returned.");
        }

        if (cancelled) return;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          businessName: user.businessName || "",
          businessDescription: user.businessDescription || "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const payload = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        businessName: profile.businessName.trim(),
        businessDescription:
          profile.businessDescription.trim(),
      };

      const response = await updateMyProfile(payload);
      const updatedUser = response?.data;

      if (!updatedUser) {
        throw new Error("Updated profile was not returned.");
      }

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        businessName: updatedUser.businessName || "",
        businessDescription:
          updatedUser.businessDescription || "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.dispatchEvent(new Event("user-updated"));

      setSuccess("Your profile has been updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-store-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>My Profile</h1>
            <p>
              View and manage your personal and business
              account information.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-panel">
            <p>Loading your profile...</p>
          </div>
        ) : (
          <>
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p
                className="store-success-message"
                role="status"
              >
                {success}
              </p>
            )}

            <form
              className="store-profile-layout"
              onSubmit={handleSubmit}
            >
              <aside className="dashboard-panel store-preview-card">
                <div className="store-logo">
                  <User size={36} />
                </div>

                <h2>{profile.name || "Vendor"}</h2>
                <p>{profile.email}</p>

                <span className="verified-store">
                  Vendor Account
                </span>
              </aside>

              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Personal Information</h2>
                    <p>
                      Update the information associated
                      with your account.
                    </p>
                  </div>
                </div>

                <div className="store-form">
                  <div className="form-group">
                    <label htmlFor="profile-name">
                      Full Name
                    </label>
                    <div className="input-with-icon">
                      <User size={17} />
                      <input
                        id="profile-name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        minLength={2}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="profile-email">
                      Email Address
                    </label>
                    <div className="input-with-icon">
                      <Mail size={17} />
                      <input
                        id="profile-email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="profile-phone">
                      Phone Number
                    </label>
                    <div className="input-with-icon">
                      <Phone size={17} />
                      <input
                        id="profile-phone"
                        name="phoneNumber"
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="business-name">
                      Business Name
                    </label>
                    <div className="input-with-icon">
                      <BriefcaseBusiness size={17} />
                      <input
                        id="business-name"
                        name="businessName"
                        value={profile.businessName}
                        onChange={handleChange}
                        minLength={5}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group store-description">
                    <label htmlFor="business-description">
                      Business Description
                    </label>
                    <textarea
                      id="business-description"
                      name="businessDescription"
                      rows="4"
                      value={profile.businessDescription}
                      onChange={handleChange}
                      minLength={5}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <p>
                      <ShieldCheck size={16} /> Your
                      account information is managed
                      securely through XI Marketplace.
                    </p>
                  </div>

                  <button
                    className="save-store-button"
                    type="submit"
                    disabled={saving}
                  >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save Changes"}
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

export default VendorPersonalProfile;
