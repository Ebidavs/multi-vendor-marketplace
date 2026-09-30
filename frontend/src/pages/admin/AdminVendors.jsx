import { useState } from "react";
import {
  Search,
  Store,
  BadgeCheck,
  Clock,
  MoreVertical,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminVendors() {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      store: "TechHub Store",
      owner: "Michael James",
      products: 15,
      sales: "₦1,250,000",
      status: "Approved",
    },
    {
      id: 2,
      store: "Urban Fashion",
      owner: "Daniel Thomas",
      products: 28,
      sales: "₦980,000",
      status: "Approved",
    },
    {
      id: 3,
      store: "Home Essentials",
      owner: "Mary George",
      products: 19,
      sales: "₦720,500",
      status: "Pending",
    },
    {
      id: 4,
      store: "Beauty Corner",
      owner: "Jennifer Paul",
      products: 0,
      sales: "₦0",
      status: "Pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const updateStatus = (vendorId, status) => {
    setVendors((previous) =>
      previous.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, status }
          : vendor
      )
    );
  };

  const filteredVendors = vendors.filter((vendor) =>
    `${vendor.store} ${vendor.owner}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
            value="184"
          />

          <MiniStat
            icon={BadgeCheck}
            title="Approved"
            value="172"
            type="blue"
          />

          <MiniStat
            icon={Clock}
            title="Pending Approval"
            value="12"
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

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Products</th>
                  <th>Total Sales</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-store-avatar">
                          <Store size={18} />
                        </div>

                        <strong>{vendor.store}</strong>
                      </div>
                    </td>

                    <td>{vendor.owner}</td>
                    <td>{vendor.products}</td>

                    <td>
                      <strong>{vendor.sales}</strong>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${vendor.status.toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </td>

                    <td>
                      {vendor.status === "Pending" ? (
                        <button
                          className="approve-vendor-button"
                          onClick={() =>
                            updateStatus(
                              vendor.id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>
                      ) : (
                        <button className="admin-icon-button">
                          <MoreVertical size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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