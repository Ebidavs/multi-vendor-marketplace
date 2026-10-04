import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ShoppingBag,
  Package,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  getVendorDashboard,
  getVendorOrders,
} from "../../services/api";

import "./vendor.css";

function VendorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const formatMoney = (amount) => {
    if (
      amount === null ||
      amount === undefined
    ) {
      return "—";
    }

    return `₦${Number(
      amount
    ).toLocaleString()}`;
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResponse,
          ordersResponse,
        ] = await Promise.all([
          getVendorDashboard(),
          getVendorOrders(),
        ]);

        setDashboard(
          dashboardResponse.data || null
        );

        const backendOrders =
          ordersResponse.data?.items || [];

        const formattedOrders =
          backendOrders
            .slice(0, 5)
            .map((order) => ({
              id: order._id || order.id,

              customer:
                order.customerId?.name ||
                order.shippingAddress
                  ?.fullName ||
                "Customer",

              product:
                order.items?.[0]
                  ?.productId?.name ||
                order.items?.[0]
                  ?.productName ||
                "Order items",

              amount: formatMoney(
                order.totalAmount
              ),

              status: formatStatus(
                order.status
              ),
            }));

        setRecentOrders(
          formattedOrders
        );
      } catch (err) {
        console.error(
          "Vendor dashboard error:",
          err
        );

        setError(
          err.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const shop = dashboard?.shop;

  const storeName =
    shop?.name ||
    shop?.shopName ||
    "Vendor";

  const stats = [
    {
      title: "Total Sales",
      value: formatMoney(
        dashboard?.totalSales
      ),
      icon: null,
      currency: true,
    },
    {
      title: "Total Orders",
      value:
        dashboard?.totalOrders ??
        "—",
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value:
        dashboard?.totalProducts ??
        0,
      icon: Package,
    },
    {
      title: "Active Products",
      value:
        dashboard?.activeProducts ??
        0,
      icon: CheckCircle2,
    },
  ];

  const handleViewStore = () => {
    if (shop?.id || shop?._id) {
      navigate(
        `/shops/${
          shop.id || shop._id
        }`
      );

      return;
    }

    navigate("/vendor/profile");
  };

  if (loading) {
    return (
      <DashboardLayout role="vendor">
        <section className="vendor-dashboard">
          <div className="dashboard-panel">
            <p>
              Loading dashboard...
            </p>
          </div>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-dashboard">
        <div className="dashboard-page-heading">
          <div>
            <h1>
              Welcome back,{" "}
              {storeName} 👋
            </h1>

            <p>
              Here's what's happening
              with your store today.
              Track your orders,
              products and store
              activity from one place.
            </p>
          </div>

          <button
            className="view-store-button"
            onClick={
              handleViewStore
            }
          >
            View Store
          </button>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                className="stat-card"
                key={stat.title}
              >
                <div className="stat-card-top">
                  <div className="stat-icon">
                    {stat.currency ? (
                      <span className="dashboard-naira-icon">
                        ₦
                      </span>
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                </div>

                <p className="stat-title">
                  {stat.title}
                </p>

                <h2>{stat.value}</h2>

                <span className="stat-period">
                  Current store data
                </span>
              </article>
            );
          })}
        </div>

        <div className="vendor-dashboard-grid">
          <section className="dashboard-panel sales-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Store Performance
                </h2>

                <p>
                  Current product
                  performance
                </p>
              </div>
            </div>

            <div className="summary-list">
              <div>
                <span>
                  Total products
                </span>

                <strong>
                  {dashboard
                    ?.totalProducts ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  Active products
                </span>

                <strong>
                  {dashboard
                    ?.activeProducts ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  Total orders
                </span>

                <strong>
                  {dashboard
                    ?.totalOrders ??
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Total sales
                </span>

                <strong>
                  {formatMoney(
                    dashboard
                      ?.totalSales
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel store-summary">
            <div className="panel-heading">
              <div>
                <h2>
                  Store Summary
                </h2>

                <p>
                  Your store
                  information
                </p>
              </div>
            </div>

            <div className="summary-list">
              <div>
                <span>
                  Store name
                </span>

                <strong>
                  {storeName}
                </strong>
              </div>

              <div>
                <span>
                  Products
                </span>

                <strong>
                  {dashboard
                    ?.totalProducts ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  Active products
                </span>

                <strong>
                  {dashboard
                    ?.activeProducts ??
                    0}
                </strong>
              </div>

              <div>
                <span>
                  Store status
                </span>

                <strong>
                  {shop
                    ? "Active"
                    : "Not created"}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-panel recent-orders-panel">
          <div className="panel-heading">
            <div>
              <h2>
                Recent Orders
              </h2>

              <p>
                Your latest customer
                orders
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate(
                  "/vendor/orders"
                )
              }
            >
              View All
            </button>
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
                {recentOrders.length >
                0 ? (
                  recentOrders.map(
                    (order) => (
                      <tr
                        key={
                          order.id
                        }
                      >
                        <td className="order-id">
                          {order.id}
                        </td>

                        <td>
                          {
                            order.customer
                          }
                        </td>

                        <td>
                          {
                            order.product
                          }
                        </td>

                        <td className="order-amount">
                          {
                            order.amount
                          }
                        </td>

                        <td>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
                          >
                            {
                              order.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorDashboard;
