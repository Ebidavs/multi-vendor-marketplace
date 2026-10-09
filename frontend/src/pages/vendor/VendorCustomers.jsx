
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  ShoppingBag,
  UserPlus,
  Mail,
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

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCustomerDetails = (order) => {
  const customer =
    order.customer || order.user || order.customerId;

  // An ID alone is not enough to identify a customer
  // by name or email.
  if (!customer || typeof customer !== "object") {
    return null;
  }

  const id = customer._id || customer.id;
  const name = customer.name || customer.fullName;
  const email = customer.email;

  if (!id || (!name && !email)) {
    return null;
  }

  return {
    id: String(id),
    name: name || "Customer",
    email: email || "",
  };
};

const getOrderAmount = (order) => {
  const amount =
    order.totalAmount ??
    order.totalPrice ??
    order.total ??
    order.amount;

  if (amount === null || amount === undefined) {
    return null;
  }

  const parsedAmount = Number(amount);

  return Number.isFinite(parsedAmount)
    ? parsedAmount
    : null;
};

function VendorCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMoreOrders, setHasMoreOrders] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const allOrders = [];
        const limit = 50;
        let page = 1;
        let morePages = true;

        // Fetch a bounded number of pages so the page
        // doesn't make unlimited requests.
        while (morePages && page <= 20) {
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
            morePages = page < Number(pagination.pages);
          } else {
            morePages = pageOrders.length === limit;
          }

          page += 1;
        }

        if (!cancelled) {
          setOrders(allOrders);
          setHasMoreOrders(morePages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load customers."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const customer = getCustomerDetails(order);

      if (!customer) return;

      const amount = getOrderAmount(order);

      const orderDate =
        order.createdAt ||
        order.orderDate ||
        order.date;

      const existing = customerMap.get(customer.id);

      if (!existing) {
        customerMap.set(customer.id, {
          ...customer,
          orders: 1,
          spent: amount ?? 0,
          hasCompleteAmounts: amount !== null,
          lastOrder: orderDate || null,
          firstOrder: orderDate || null,
        });

        return;
      }

      existing.orders += 1;

      if (amount !== null) {
        existing.spent += amount;
      } else {
        existing.hasCompleteAmounts = false;
      }

      if (
        orderDate &&
        (!existing.lastOrder ||
          new Date(orderDate) >
            new Date(existing.lastOrder))
      ) {
        existing.lastOrder = orderDate;
      }

      if (
        orderDate &&
        (!existing.firstOrder ||
          new Date(orderDate) <
            new Date(existing.firstOrder))
      ) {
        existing.firstOrder = orderDate;
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) =>
        new Date(b.lastOrder || 0) -
        new Date(a.lastOrder || 0)
    );
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search)
    );
  }, [customers, searchTerm]);

  const statistics = useMemo(() => {
    const currentDate = new Date();

    const newThisMonth = customers.filter((customer) => {
      if (!customer.firstOrder) return false;

      const date = new Date(customer.firstOrder);

      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    }).length;

    const repeatCustomers = customers.filter(
      (customer) => customer.orders > 1
    ).length;

    const customersWithCompleteAmounts =
      customers.filter(
        (customer) => customer.hasCompleteAmounts
      );

    const averageSpend =
      customers.length > 0 &&
      customersWithCompleteAmounts.length === customers.length
        ? customers.reduce(
            (total, customer) =>
              total + customer.spent,
            0
          ) / customers.length
        : null;

    return {
      totalCustomers: customers.length,
      newThisMonth,
      repeatCustomers,
      averageSpend,
    };
  }, [customers]);

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-customers-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Customers</h1>
            <p>
              View customers who have purchased from
              your store.
            </p>
          </div>
        </div>

        <div className="customer-stat-grid">
          <div className="customer-stat-card">
            <Users size={22} />
            <div>
              <span>Total Customers</span>
              <strong>
                {loading
                  ? "..."
                  : statistics.totalCustomers}
              </strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <UserPlus size={22} />
            <div>
              <span>First Order This Month</span>
              <strong>
                {loading
                  ? "..."
                  : statistics.newThisMonth}
              </strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <ShoppingBag size={22} />
            <div>
              <span>Repeat Customers</span>
              <strong>
                {loading
                  ? "..."
                  : statistics.repeatCustomers}
              </strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <div className="naira-stat-icon">₦</div>
            <div>
              <span>Average Spend</span>
              <strong>
                {loading
                  ? "..."
                  : statistics.averageSpend === null
                    ? "—"
                    : formatCurrency(
                        statistics.averageSpend
                      )}
              </strong>
            </div>
          </div>
        </div>

        <section className="dashboard-panel">
          <div className="customers-toolbar">
            <div className="orders-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && hasMoreOrders && (
            <p className="customer-email">
              Showing customer statistics from the
              first 1,000 orders only.
            </p>
          )}

          <div className="table-wrapper">
            <table className="vendor-orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      Loading customers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5}>
                      Unable to display customers.
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      {searchTerm
                        ? "No customers match your search."
                        : orders.length === 0
                          ? "No customer orders yet."
                          : "Customer details are not available in the orders response."}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="order-customer">
                          <div className="customer-avatar">
                            {customer.name
                              .split(" ")
                              .filter(Boolean)
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {customer.name}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="customer-email">
                          <Mail size={14} />
                          {customer.email || "—"}
                        </span>
                      </td>

                      <td>{customer.orders}</td>

                      <td className="vendor-order-amount">
                        {customer.hasCompleteAmounts
                          ? formatCurrency(
                              customer.spent
                            )
                          : "—"}
                      </td>

                      <td>
                        {formatDate(
                          customer.lastOrder
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorCustomers;
