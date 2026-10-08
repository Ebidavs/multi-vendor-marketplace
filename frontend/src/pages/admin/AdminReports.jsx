
import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Store,
  Download,
  Package,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getAdminAnalytics } from "../../services/api";

import "./admin.css";

function AdminReports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminAnalytics();

        if (cancelled) return;

        const data = response?.data;

        if (!data || typeof data !== "object") {
          throw new Error(
            "Invalid analytics response from the server."
          );
        }

        setAnalytics(data);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load admin reports:",
          err
        );

        setError(
          err.message ||
            "Unable to load marketplace analytics."
        );

        setAnalytics(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const formatNumber = (value) => {
    if (typeof value !== "number") {
      return "—";
    }

    return value.toLocaleString("en-NG");
  };

  const exportReport = () => {
    if (!analytics) return;

    const rows = [
      ["Metric", "Value"],
      ["Total Users", analytics.totalUsers],
      ["Total Customers", analytics.totalCustomers],
      ["Total Vendors", analytics.totalVendors],
      ["Total Shops", analytics.totalShops],
      ["Total Products", analytics.totalProducts],
      ["Total Revenue", analytics.totalRevenue],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text =
              value === null || value === undefined
                ? "Unavailable"
                : String(value);

            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `xi-market-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const unavailableText =
    "This metric is not yet available from the backend.";

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading admin-heading-action">
          <div>
            <h1>Reports & Analytics</h1>
            <p>
              Understand marketplace activity,
              customer growth and vendor performance.
            </p>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={exportReport}
            disabled={loading || !analytics}
            title="Download available analytics as CSV"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        {error && (
          <p
            className="login-error"
            role="alert"
            style={{ marginBottom: "20px" }}
          >
            {error}
          </p>
        )}

        <div className="admin-report-stats">
          <ReportStat
            title="Marketplace Revenue"
            value="—"
            note="Not yet available"
            currency
          />

          <ReportStat
            title="Total Products"
            value={
              loading
                ? "..."
                : formatNumber(analytics?.totalProducts)
            }
            note="Marketplace listings"
            icon={Package}
          />

          <ReportStat
            title="Customers"
            value={
              loading
                ? "..."
                : formatNumber(analytics?.totalCustomers)
            }
            note="Registered customers"
            icon={Users}
          />

          <ReportStat
            title="Vendors"
            value={
              loading
                ? "..."
                : formatNumber(analytics?.totalVendors)
            }
            note="Registered vendors"
            icon={Store}
          />
        </div>

        <div className="admin-report-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Revenue Growth</h2>
                <p>
                  Marketplace revenue over the last
                  6 months
                </p>
              </div>

              <TrendingUp size={19} />
            </div>

            <div
              className="report-chart"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "220px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div>
                <TrendingUp
                  size={34}
                  style={{
                    opacity: 0.4,
                    marginBottom: "12px",
                  }}
                />

                <h3>Revenue data unavailable</h3>

                <p>{unavailableText}</p>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Marketplace Insights</h2>
                <p>
                  Important marketplace indicators
                </p>
              </div>
            </div>

            <div className="market-insights">
              <Insight
                title="Total Users"
                value={
                  loading
                    ? "..."
                    : formatNumber(analytics?.totalUsers)
                }
                note="Registered accounts"
              />

              <Insight
                title="Total Shops"
                value={
                  loading
                    ? "..."
                    : formatNumber(analytics?.totalShops)
                }
                note="Marketplace shops"
              />

              <Insight
                title="Total Products"
                value={
                  loading
                    ? "..."
                    : formatNumber(analytics?.totalProducts)
                }
                note="Product listings"
              />

              <Insight
                title="Average Order Value"
                value="—"
                note="Not yet available"
              />
            </div>
          </section>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Top Performing Vendors</h2>
              <p>
                Vendor rankings based on marketplace
                sales and order activity
              </p>
            </div>

            <button
              type="button"
              className="admin-icon-button"
              title="Refresh analytics"
              aria-label="Refresh analytics"
              disabled={loading}
              onClick={() =>
                setRefreshKey((previous) => previous + 1)
              }
            >
              <RefreshCw size={17} />
            </button>
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
                <tr>
                  <td colSpan={4}>
                    <div
                      style={{
                        padding: "35px 20px",
                        textAlign: "center",
                      }}
                    >
                      <Store
                        size={32}
                        style={{
                          opacity: 0.4,
                          marginBottom: "12px",
                        }}
                      />

                      <h3>
                        Vendor rankings unavailable
                      </h3>

                      <p>
                        Sales and order statistics
                        are required to rank vendors.
                      </p>
                    </div>
                  </td>
                </tr>
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
  note,
  icon: Icon,
  currency = false,
}) {
  return (
    <article className="admin-report-stat">
      <div className="report-stat-icon">
        {currency ? (
          <span>₦</span>
        ) : Icon ? (
          <Icon size={20} />
        ) : (
          <ShoppingBag size={20} />
        )}
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

      <small>{note}</small>
    </article>
  );
}

function Insight({ title, value, note }) {
  return (
    <div className="market-insight">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <small>{note}</small>
    </div>
  );
}

export default AdminReports;
