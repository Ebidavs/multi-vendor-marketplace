
import { useEffect, useState } from "react";

import {
  Search,
  Store,
  BadgeCheck,
  Clock,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import VendorsTable from "../../components/dashboard/VendorsTable";

import {
  getAdminVendors,
  updateVendorStatus,
} from "../../services/api";

import "./admin.css";

function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingVendorId, setUpdatingVendorId] = useState(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminVendors();

        const backendVendors =
          response?.data?.vendors || [];

        const formattedVendors = backendVendors.map(
          (vendor) => ({
            id: vendor.id || vendor._id,

            store:
              vendor.shop?.name ||
              "No shop created",

            owner:
              vendor.name ||
              "Vendor",

            email: vendor.email || "",

            isActive: Boolean(vendor.isActive),

            createdAt: vendor.createdAt || null,
          })
        );

        setVendors(formattedVendors);
      } catch (err) {
        console.error("Load vendors error:", err);

        setError(
          err.message || "Failed to load vendors."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  const updateStatus = async (vendorId, isActive) => {
    if (updatingVendorId !== null) return;

    try {
      setUpdatingVendorId(vendorId);
      setError("");

      await updateVendorStatus(vendorId, isActive);

      setVendors((previousVendors) =>
        previousVendors.map((vendor) =>
          vendor.id === vendorId
            ? {
                ...vendor,
                isActive,
              }
            : vendor
        )
      );
    } catch (err) {
      console.error(
        "Update vendor status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update vendor status."
      );
    } finally {
      setUpdatingVendorId(null);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      vendor.store.toLowerCase().includes(search) ||
      vendor.owner.toLowerCase().includes(search) ||
      vendor.email.toLowerCase().includes(search)
    );
  });

  const activeVendors = vendors.filter(
    (vendor) => vendor.isActive
  ).length;

  const inactiveVendors =
    vendors.length - activeVendors;

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Vendors</h1>

            <p>
              Review and manage sellers operating
              on Xi Market.
            </p>
          </div>
        </div>

        <div className="admin-mini-stats">
          <MiniStat
            icon={Store}
            title="Total Vendors"
            value={vendors.length}
          />

          <MiniStat
            icon={BadgeCheck}
            title="Active"
            value={activeVendors}
            type="blue"
          />

          <MiniStat
            icon={Clock}
            title="Inactive"
            value={inactiveVendors}
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-orders">
              <Store size={36} />

              <h3>Loading vendors...</h3>
            </div>
          ) : (
            <>
              <VendorsTable
                vendors={filteredVendors}
                onStatusChange={updateStatus}
                updatingVendorId={updatingVendorId}
              />

              {filteredVendors.length === 0 && (
                <div className="empty-orders">
                  <Store size={36} />

                  <h3>No vendors found</h3>

                  <p>
                    No vendors match your current search.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </DashboardLayout>
  );
}

function MiniStat({
  icon: Icon,
  title,
  value,
  type = "green",
}) {
  return (
    <article className="admin-mini-stat">
      <div className={`admin-mini-icon ${type}`}>
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default AdminVendors;
