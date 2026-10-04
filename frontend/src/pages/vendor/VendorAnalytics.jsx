import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorAnalytics() {
  const analytics = [
    {
      title: "Revenue",
      value: "₦1,250,000",
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "42",
      change: "+8.2%",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: "327",
      change: "+18.4%",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "8.4%",
      change: "+2.1%",
      icon: TrendingUp,
    },
  ];

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-analytics-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Analytics</h1>
            <p>
              Track your store's sales and performance.
            </p>
          </div>

          <select className="analytics-period">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </select>
        </div>

        <div className="stats-grid">
          {analytics.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className="stat-card"
                key={item.title}
              >
                <div className="stat-card-top">
                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>

                  <span className="stat-change">
                    {item.change}
                  </span>
                </div>

                <p className="stat-title">
                  {item.title}
                </p>

                <h2>{item.value}</h2>

                <span className="stat-period">
                  Compared to previous period
                </span>
              </article>
            );
          })}
        </div>

        <div className="analytics-grid">
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Revenue Overview</h2>
                <p>Revenue generated this week</p>
              </div>
            </div>

            <div className="analytics-chart">
              {[45, 62, 54, 76, 65, 91, 82].map(
                (height, index) => (
                  <div
                    className="analytics-bar"
                    key={index}
                  >
                    <div
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                )
              )}
            </div>

            <div className="analytics-days">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Top Products</h2>
                <p>Best performing products</p>
              </div>
            </div>

            <div className="top-products-list">
              <div>
                <span>Wireless Headphones</span>
                <strong>₦450,000</strong>
              </div>

              <div>
                <span>Smart Watch</span>
                <strong>₦340,000</strong>
              </div>

              <div>
                <span>Running Sneakers</span>
                <strong>₦232,000</strong>
              </div>

              <div>
                <span>Laptop Backpack</span>
                <strong>₦171,000</strong>
              </div>
            </div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default VendorAnalytics;