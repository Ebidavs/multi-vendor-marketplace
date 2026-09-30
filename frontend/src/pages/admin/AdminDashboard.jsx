import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₦8,450,000",
      change: "+14.2%",
      currency: true,
    },
    {
      title: "Total Users",
      value: "2,481",
      change: "+12.5%",
      icon: Users,
    },
    {
      title: "Active Vendors",
      value: "184",
      change: "+8.4%",
      icon: Store,
    },
    {
      title: "Total Orders",
      value: "1,327",
      change: "+16.8%",
      icon: ShoppingBag,
    },
  ];

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

        <div className="admin-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                className="admin-stat-card"
                key={stat.title}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    {stat.currency ? (
                      <span>₦</span>
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>

                  <span className="admin-stat-change">
                    {stat.change}
                  </span>
                </div>

                <span className="admin-stat-title">
                  {stat.title}
                </span>

                <strong>{stat.value}</strong>

                <small>Compared to last month</small>
              </article>
            );
          })}
        </div>

        <div className="admin-dashboard-grid">
          <section className="admin-panel admin-performance">
            <div className="admin-panel-heading">
              <div>
                <h2>Marketplace Performance</h2>
                <p>Revenue performance this week</p>
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
                title="Pending Vendors"
                value="12"
                type="green"
              />

              <Summary
                icon={Package}
                title="Active Products"
                value="1,845"
                type="blue"
              />

              <Summary
                icon={Users}
                title="New Customers"
                value="86"
                type="orange"
              />

              <Summary
                icon={ShoppingBag}
                title="Pending Orders"
                value="38"
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