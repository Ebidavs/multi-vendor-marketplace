import {
  TrendingUp,
  ShoppingBag,
  Users,
  Store,
  Download,
  ArrowUpRight,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminReports() {
  const topVendors = [
    {
      name: "TechHub Store",
      orders: 342,
      revenue: "₦2,850,000",
    },
    {
      name: "Urban Fashion",
      orders: 284,
      revenue: "₦1,980,000",
    },
    {
      name: "Home Essentials",
      orders: 219,
      revenue: "₦1,420,500",
    },
    {
      name: "Beauty Corner",
      orders: 184,
      revenue: "₦985,000",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading admin-heading-action">
          <div>
            <h1>Reports & Analytics</h1>
            <p>
              Understand marketplace growth, revenue and vendor
              performance.
            </p>
          </div>

          <button
            className="admin-secondary-button"
            onClick={() => alert("Report export will connect to the backend.")}
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="admin-report-stats">
          <ReportStat
            title="Marketplace Revenue"
            value="₦8,450,000"
            change="+14.2%"
            currency
          />

          <ReportStat
            title="Orders"
            value="1,327"
            change="+16.8%"
            icon={ShoppingBag}
          />

          <ReportStat
            title="Customers"
            value="2,297"
            change="+12.5%"
            icon={Users}
          />

          <ReportStat
            title="Vendors"
            value="184"
            change="+8.4%"
            icon={Store}
          />
        </div>

        <div className="admin-report-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Revenue Growth</h2>
                <p>Marketplace revenue over the last 6 months</p>
              </div>

              <TrendingUp size={19} />
            </div>

            <div className="report-chart">
              {[
                { month: "Apr", height: 42 },
                { month: "May", height: 56 },
                { month: "Jun", height: 48 },
                { month: "Jul", height: 68 },
                { month: "Aug", height: 77 },
                { month: "Sep", height: 94 },
              ].map((item) => (
                <div className="report-bar-column" key={item.month}>
                  <div className="report-bar-space">
                    <div
                      className="report-bar"
                      style={{ height: `${item.height}%` }}
                    ></div>
                  </div>

                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Marketplace Insights</h2>
                <p>Important performance indicators</p>
              </div>
            </div>

            <div className="market-insights">
              <Insight
                title="Average Order Value"
                value="₦63,677"
                change="+6.4%"
              />

              <Insight
                title="Customer Growth"
                value="12.5%"
                change="+3.2%"
              />

              <Insight
                title="Vendor Growth"
                value="8.4%"
                change="+2.8%"
              />

              <Insight
                title="Order Completion"
                value="89.3%"
                change="+4.1%"
              />
            </div>
          </section>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Top Performing Vendors</h2>
              <p>Vendors generating the most marketplace activity</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Performance</th>
                </tr>
              </thead>

              <tbody>
                {topVendors.map((vendor, index) => (
                  <tr key={vendor.name}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="vendor-rank">
                          {index + 1}
                        </div>

                        <strong>{vendor.name}</strong>
                      </div>
                    </td>

                    <td>{vendor.orders}</td>

                    <td>
                      <strong>{vendor.revenue}</strong>
                    </td>

                    <td>
                      <span className="report-growth">
                        <ArrowUpRight size={13} />
                        Growing
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

function ReportStat({
  title,
  value,
  change,
  icon: Icon,
  currency = false,
}) {
  return (
    <article className="admin-report-stat">
      <div className="report-stat-icon">
        {currency ? <span>₦</span> : <Icon size={20} />}
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

      <small>{change} this month</small>
    </article>
  );
}

function Insight({ title, value, change }) {
  return (
    <div className="market-insight">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <small>{change}</small>
    </div>
  );
}

export default AdminReports;