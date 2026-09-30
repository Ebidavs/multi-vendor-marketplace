import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Users,} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorDashboard() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Sales",
      value: "₦1,250,000",
      change: "+12.5%",
      icon: null,
      currency: true,
    },
    {
      title: "Total Orders",
      value: "42",
      change: "+8.2%",
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: "15",
      change: "+2",
      icon: Package,
    },
    {
      title: "Customers",
      value: "327",
      change: "+18.4%",
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: "#MKT1024",
      customer: "David Johnson",
      product: "Wireless Headphones",
      amount: "₦45,000",
      status: "Delivered",
    },
    {
      id: "#MKT1023",
      customer: "Sarah Williams",
      product: "Smart Watch",
      amount: "₦85,000",
      status: "Processing",
    },
    {
      id: "#MKT1022",
      customer: "Michael James",
      product: "Laptop Backpack",
      amount: "₦28,500",
      status: "Shipped",
    },
    {
      id: "#MKT1021",
      customer: "Grace Peter",
      product: "Bluetooth Speaker",
      amount: "₦32,000",
      status: "Cancelled",
    },
  ];

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-dashboard">
        <div className="dashboard-page-heading">
          <div>
            <h1>Welcome back, TechHub 👋</h1>

            <p>
              Here's what's happening with your store today. Track your sales,
              orders, products and customer activity from one place.
            </p>
          </div>

          <button
            className="view-store-button"
            onClick={() => navigate("/vendors/techhub-store")}
          >
            View Store
          </button>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="stat-card" key={stat.title}>
                <div className="stat-card-top">
                  <div className="stat-icon">
                    {stat.currency ? (
                      <span className="dashboard-naira-icon">₦</span>
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>

                  <span className="stat-change">{stat.change}</span>
                </div>

                <p className="stat-title">{stat.title}</p>

                <h2>{stat.value}</h2>

                <span className="stat-period">Compared to last month</span>
              </article>
            );
          })}
        </div>

        <div className="vendor-dashboard-grid">
          <section className="dashboard-panel sales-panel">
            <div className="panel-heading">
              <div>
                <h2>Sales Overview</h2>
                <p>Your sales performance over time</p>
              </div>

              <select defaultValue="7days">
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="year">This year</option>
              </select>
            </div>

            <div className="chart-placeholder">
              <div className="fake-chart">
                <div style={{ height: "38%" }}></div>
                <div style={{ height: "52%" }}></div>
                <div style={{ height: "46%" }}></div>
                <div style={{ height: "68%" }}></div>
                <div style={{ height: "58%" }}></div>
                <div style={{ height: "82%" }}></div>
                <div style={{ height: "72%" }}></div>
              </div>

              <div className="chart-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel store-summary">
            <div className="panel-heading">
              <div>
                <h2>Store Summary</h2>
                <p>This month's performance</p>
              </div>
            </div>

            <div className="summary-list">
              <div>
                <span>Store rating</span>
                <strong>4.8 / 5</strong>
              </div>

              <div>
                <span>Product views</span>
                <strong>2,481</strong>
              </div>

              <div>
                <span>Conversion rate</span>
                <strong>8.4%</strong>
              </div>

              <div>
                <span>Pending orders</span>
                <strong>6</strong>
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-panel recent-orders-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Orders</h2>
              <p>Your latest customer orders</p>
            </div>

            <button className="text-button">View All</button>
          </div>

          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td className="order-amount">{order.amount}</td>

                    <td>
                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
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

export default VendorDashboard;
