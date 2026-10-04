import { useState } from "react";
import {
  Search,
  Store,
  BadgeCheck,
  Clock,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import VendorsTable from "../../components/dashboard/VendorsTable";
import "./admin.css";

function AdminVendors() {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      store: "TechHub Store",
      owner: "Michael James",
      products: 15,
      sales: "₦1,250,000",
      isActive: true,
    },
    {
      id: 2,
      store: "Urban Fashion",
      owner: "Daniel Thomas",
      products: 28,
      sales: "₦980,000",
      isActive: true,
    },
    {
      id: 3,
      store: "Home Essentials",
      owner: "Mary George",
      products: 19,
      sales: "₦720,500",
      isActive: false,
    },
    {
      id: 4,
      store: "Beauty Corner",
      owner: "Jennifer Paul",
      products: 0,
      sales: "₦0",
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const updateStatus = (
    vendorId,
    isActive
  ) => {
    // Temporary frontend update.
    // Later this will call the admin vendor status API.
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
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      `${vendor.store} ${vendor.owner}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
              Review and manage sellers operating on
              MarketHub.
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
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          <VendorsTable
            vendors={filteredVendors}
            onStatusChange={updateStatus}
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
      <div
        className={`admin-mini-icon ${type}`}
      >
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