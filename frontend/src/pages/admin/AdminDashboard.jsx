import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminOverview from "../../components/dashboard/AdminOverview";

import {
  getAdminAnalytics,
} from "../../services/api";

import "./admin.css";

function AdminDashboard() {
  const [analytics, setAnalytics] =
    useState({
      totalUsers: 0,
      totalVendors: 0,
      totalCustomers: 0,
      totalShops: 0,
      totalProducts: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminAnalytics();

        setAnalytics({
          totalUsers:
            response.data?.totalUsers ??
            0,

          totalVendors:
            response.data
              ?.totalVendors ?? 0,

          totalCustomers:
            response.data
              ?.totalCustomers ?? 0,

          totalShops:
            response.data
              ?.totalShops ?? 0,

          totalProducts:
            response.data
              ?.totalProducts ?? 0,
        });
      } catch (err) {
        console.error(
          "Admin analytics error:",
          err
        );

        setError(
          err.message ||
            "Failed to load marketplace analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-welcome">
          <div>
            <span className="admin-eyebrow">
              MARKETPLACE OVERVIEW
            </span>

            <h1>
              Welcome back, Admin 👋
            </h1>

            <p>
              Monitor MarketHub
              performance, vendors,
              customers, products and
              marketplace activity.
            </p>
          </div>

          <div className="admin-health">
            <span></span>
            Marketplace Active
          </div>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {loading ? (
          <section className="admin-panel">
            <p>
              Loading marketplace
              analytics...
            </p>
          </section>
        ) : (
          <>
            <AdminOverview
              stats={analytics}
            />

            <div className="admin-dashboard-grid">
              <section className="admin-panel admin-performance">
                <div className="admin-panel-heading">
                  <div>
                    <h2>
                      Marketplace
                      Overview
                    </h2>

                    <p>
                      Current platform
                      statistics
                    </p>
                  </div>

                  <TrendingUp
                    size={20}
                  />
                </div>

                <div className="admin-summary-list">
                  <Summary
                    icon={Users}
                    title="Total Users"
                    value={
                      analytics.totalUsers
                    }
                    type="green"
                  />

                  <Summary
                    icon={Store}
                    title="Total Vendors"
                    value={
                      analytics.totalVendors
                    }
                    type="blue"
                  />

                  <Summary
                    icon={Users}
                    title="Customers"
                    value={
                      analytics.totalCustomers
                    }
                    type="orange"
                  />
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>
                      Marketplace
                      Summary
                    </h2>

                    <p>
                      Current platform
                      activity
                    </p>
                  </div>
                </div>

                <div className="admin-summary-list">
                  <Summary
                    icon={Store}
                    title="Total Shops"
                    value={
                      analytics.totalShops
                    }
                    type="green"
                  />

                  <Summary
                    icon={Package}
                    title="Total Products"
                    value={
                      analytics.totalProducts
                    }
                    type="blue"
                  />

                  <Summary
                    icon={Users}
                    title="Total Customers"
                    value={
                      analytics.totalCustomers
                    }
                    type="orange"
                  />

                  <Summary
                    icon={ShoppingBag}
                    title="Total Vendors"
                    value={
                      analytics.totalVendors
                    }
                    type="purple"
                  />
                </div>
              </section>
            </div>

            <section className="admin-panel admin-recent-orders">
              <div className="admin-panel-heading">
                <div>
                  <h2>
                    Platform Status
                  </h2>

                  <p>
                    Current MarketHub
                    marketplace totals
                  </p>
                </div>
              </div>

              <div className="admin-summary-list">
                <Summary
                  icon={Users}
                  title="Registered Users"
                  value={
                    analytics.totalUsers
                  }
                  type="green"
                />

                <Summary
                  icon={Store}
                  title="Vendor Accounts"
                  value={
                    analytics.totalVendors
                  }
                  type="blue"
                />

                <Summary
                  icon={Package}
                  title="Active Products"
                  value={
                    analytics.totalProducts
                  }
                  type="orange"
                />

                <Summary
                  icon={ShoppingBag}
                  title="Vendor Shops"
                  value={
                    analytics.totalShops
                  }
                  type="purple"
                />
              </div>
            </section>
          </>
        )}
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

      <strong>
        {Number(
          value || 0
        ).toLocaleString()}
      </strong>
    </div>
  );
}

export default AdminDashboard;