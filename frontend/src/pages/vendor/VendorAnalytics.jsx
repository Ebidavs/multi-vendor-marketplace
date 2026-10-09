
import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getVendorCustomerOrders } from "../../services/api";

import "./vendor.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const getOrderDate = (order) => {
  const value =
    order.createdAt ||
    order.orderDate ||
    order.date;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getOrderAmount = (order) => {
  const value =
    order.totalAmount ??
    order.totalPrice ??
    order.total ??
    order.amount;

  if (value === null || value === undefined) {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount) ? amount : null;
};

const getCustomerId = (order) => {
  const customer =
    order.customer || order.user || order.customerId;

  if (!customer) return null;

  if (typeof customer === "string") {
    return customer;
  }

  return customer._id || customer.id || null;
};

const getProductEntries = (order) => {
  const items = order.items || order.orderItems || [];

  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const product = item.product || item.productId || {};

    const productId =
      typeof product === "object"
        ? product._id || product.id
        : product;

    const name =
      (typeof product === "object" &&
        (product.name || product.title)) ||
      item.name ||
      item.productName ||
      "Unnamed Product";

    const quantity = Number(item.quantity ?? 1);

    const lineTotal = Number(
      item.totalPrice ??
      item.subtotal ??
      item.total ??
      (item.price != null
        ? Number(item.price) * quantity
        : NaN)
    );

    return {
      id: productId || name,
      name,
      quantity: Number.isFinite(quantity) ? quantity : 0,
      lineTotal: Number.isFinite(lineTotal)
        ? lineTotal
        : null,
    };
  });
};

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

function VendorAnalytics() {
  const [period, setPeriod] = useState("7");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPartial, setIsPartial] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const allOrders = [];
        const limit = 50;
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 20) {
          const response = await getVendorCustomerOrders(
            page,
            limit
          );

          const data = response?.data;

          const pageOrders = Array.isArray(data)
            ? data
            : Array.isArray(data?.orders)
              ? data.orders
              : [];

          allOrders.push(...pageOrders);

          const pagination = data?.pagination;

          if (pagination?.pages != null) {
            hasMore = page < Number(pagination.pages);
          } else {
            hasMore = pageOrders.length === limit;
          }

          page += 1;
        }

        if (!cancelled) {
          setOrders(allOrders);
          setIsPartial(hasMore);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load analytics.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const analyticsData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const periodStart =
      period === "year"
        ? new Date(currentYear, 0, 1)
        : startOfDay(
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() -
                (Number(period) - 1)
            )
          );

    const selectedOrders = orders.filter((order) => {
      const date = getOrderDate(order);
      return date && date >= periodStart && date <= today;
    });

    // Only delivered orders count toward realized sales.
    const deliveredOrders = selectedOrders.filter(
      (order) =>
        String(order.status || "").toLowerCase() ===
        "delivered"
    );

    const revenueKnown = deliveredOrders.every(
      (order) => getOrderAmount(order) !== null
    );

    const revenue = deliveredOrders.reduce(
      (total, order) =>
        total + (getOrderAmount(order) ?? 0),
      0
    );

    const customerIds = new Set(
      selectedOrders.map(getCustomerId).filter(Boolean)
    );

    const productsMap = new Map();

    deliveredOrders.forEach((order) => {
      getProductEntries(order).forEach((product) => {
        const existing = productsMap.get(product.id) || {
          name: product.name,
          quantity: 0,
          revenue: 0,
          revenueKnown: true,
        };

        existing.quantity += product.quantity;

        if (product.lineTotal !== null) {
          existing.revenue += product.lineTotal;
        } else {
          existing.revenueKnown = false;
        }

        productsMap.set(product.id, existing);
      });
    });

    const topProducts = Array.from(
      productsMap.values()
    )
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 4);

    const chartDays =
      period === "7" ? 7 : period === "30" ? 30 : 12;

    const chartData = [];

    for (let i = 0; i < chartDays; i++) {
      let start;
      let end;
      let label;

      if (period === "year") {
        start = new Date(currentYear, i, 1);
        end = new Date(currentYear, i + 1, 1);
        label = start.toLocaleDateString("en-NG", {
          month: "short",
        });
      } else {
        const daysBack = chartDays - 1 - i;

        start = startOfDay(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - daysBack
          )
        );

        end = new Date(start);
        end.setDate(end.getDate() + 1);

        label = start.toLocaleDateString("en-NG", {
          weekday: "short",
          ...(period === "30"
            ? { day: "numeric" }
            : {}),
        });
      }

      const matchingOrders = deliveredOrders.filter(
        (order) => {
          const date = getOrderDate(order);
          return date && date >= start && date < end;
        }
      );

      const amount = matchingOrders.reduce(
        (total, order) =>
          total + (getOrderAmount(order) ?? 0),
        0
      );

      chartData.push({
        label,
        amount,
      });
    }

    const maxRevenue = Math.max(
      ...chartData.map((item) => item.amount),
      0
    );

    return {
      revenue,
      revenueKnown,
      orderCount: selectedOrders.length,
      customerCount: customerIds.size,
      topProducts,
      chartData: chartData.map((item) => ({
        ...item,
        height:
          maxRevenue > 0
            ? (item.amount / maxRevenue) * 100
            : 0,
      })),
    };
  }, [orders, period]);

  const analytics = [
    {
      title: "Revenue",
      value: analyticsData.revenueKnown
        ? formatCurrency(analyticsData.revenue)
        : "N/A",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: String(analyticsData.orderCount),
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: String(analyticsData.customerCount),
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "N/A",
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

          <select
            className="analytics-period"
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="year">This year</option>
          </select>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {isPartial && !error && (
          <p className="customer-email">
            Analytics are based on the first 1,000
            fetched orders, not necessarily the full
            order history.
          </p>
        )}

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
                    Live data
                  </span>
                </div>

                <p className="stat-title">
                  {item.title}
                </p>

                <h2>
                  {loading
                    ? "..."
                    : error
                      ? "—"
                      : item.value}
                </h2>

                <span className="stat-period">
                  {item.title === "Conversion Rate"
                    ? "Visitor analytics unavailable"
                    : "Selected period"}
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
                <p>
                  Revenue from delivered orders
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading revenue chart...</p>
            ) : error ? (
              <p>Unable to load revenue chart.</p>
            ) : !analyticsData.revenueKnown ? (
              <p>
                Revenue data is unavailable for
                some orders.
              </p>
            ) : (
              <>
                <div className="analytics-chart">
                  {analyticsData.chartData.map(
                    (item, index) => (
                      <div
                        className="analytics-bar"
                        key={index}
                        title={`${item.label}: ${formatCurrency(
                          item.amount
                        )}`}
                      >
                        <div
                          style={{
                            height: `${item.height}%`,
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="analytics-days">
                  {analyticsData.chartData.map(
                    (item, index) => (
                      <span key={index}>
                        {item.label}
                      </span>
                    )
                  )}
                </div>
              </>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Top Products</h2>
                <p>
                  Best-selling products by quantity
                </p>
              </div>
            </div>

            <div className="top-products-list">
              {loading ? (
                <p>Loading products...</p>
              ) : error ? (
                <p>Unable to load products.</p>
              ) : analyticsData.topProducts.length === 0 ? (
                <p>
                  No delivered product sales
                  available for this period.
                </p>
              ) : (
                analyticsData.topProducts.map(
                  (product, index) => (
                    <div key={index}>
                      <span>{product.name}</span>

                      <strong>
                        {product.quantity} sold
                      </strong>
                    </div>
                  )
                )
              )}
            </div>
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default VendorAnalytics;
