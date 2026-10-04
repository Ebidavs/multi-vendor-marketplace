import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminOverview from "../../components/dashboard/AdminOverview";
import "./admin.css";

function AdminDashboard() {
  // Temporary data.
  // Later this will come from GET /api/v1/admin/analytics.
  const analytics = {
    totalUsers: 2481,
    totalVendors: 184,
    totalCustomers: 2297,
    totalShops: 180,
    totalProducts: 1845,
  };

  const recentOrders = [
    {
      id: "#MKT1032",
      customer: "David Johnson",
      vendor: "TechHub Store",
      amount: "₦85,000",
      status: "Delivered",
    },
    {
      id: "#MKT1031",
      customer: "Sarah Williams",
      vendor: "Urban Fashion",
      amount: "₦58,000",
      status: "Processing",
    },
    {
      id: "#MKT1030",
      customer: "Michael James",
      vendor: "Home Essentials",
      amount: "₦120,500",
      status: "Shipped",
    },
    {
      id: "#MKT1029",
      customer: "Grace Peter",
      vendor: "TechHub Store",
      amount: "₦45,000",
      status: "Pending",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-welcome">
          <div>
            <span className="admin-eyebrow">
              MARKETPLACE OVERVIEW
            </span>

            <h1>Welcome back, Admin 👋</h1>

            <p>
              Monitor MarketHub performance, vendors,
              customers, products and marketplace activity.
            </p>
          </div>

          <div className="admin-health">
            <span></span>
            Marketplace Healthy
          </div>
        </div>

        <AdminOverview stats={analytics} />

        <div className="admin-dashboard-grid">
          <section className="admin-panel admin-performance">
            <div className="admin-panel-heading">
              <div>
                <h2>Marketplace Performance</h2>
                <p>Platform activity this week</p>
              </div>

              <TrendingUp size={20} />
            </div>

            <div className="admin-chart">
              {[48, 67, 55, 79, 70, 94, 86].map(
                (height, index) => (
                  <div
                    className="admin-chart-column"
                    key={index}
                  >
                    <div
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>
                  </div>
                )
              )}
            </div>

            <div className="admin-chart-days">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Marketplace Summary</h2>
                <p>Current platform activity</p>
              </div>
            </div>

            <div className="admin-summary-list">
              <Summary
                icon={Store}
                title="Total Shops"
                value={analytics.totalShops}
                type="green"
              />

              <Summary
                icon={Package}
                title="Total Products"
                value={analytics.totalProducts}
                type="blue"
              />

              <Summary
                icon={Users}
                title="Total Customers"
                value={analytics.totalCustomers}
                type="orange"
              />

              <Summary
                icon={ShoppingBag}
                title="Recent Orders"
                value={recentOrders.length}
                type="purple"
              />
            </div>
          </section>
        </div>

        <section className="admin-panel admin-recent-orders">
          <div className="admin-panel-heading">
            <div>
              <h2>Recent Orders</h2>

              <p>
                Latest transactions across MarketHub
              </p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.vendor}</td>

                    <td>
                      <strong>{order.amount}</strong>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
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

function Summary({
  icon: Icon,
  title,
  value,
  type,
}) {
  return (
    <div className="admin-summary-item">
      <div
        className={`admin-summary-icon ${type}`}
      >
        <Icon size={19} />
      </div>

      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default AdminDashboard;