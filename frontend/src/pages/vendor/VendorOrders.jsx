import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import OrdersTable from "../../components/dashboard/OrdersTable";

import {
  getVendorOrders,
  updateOrderStatus,
} from "../../services/api";

import "./vendor.css";

function VendorOrders() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Format backend status values such as
  // "pending" into "Pending".
  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getVendorOrders();

        const backendOrders =
          response.data?.items || [];

        const formattedOrders =
          backendOrders.map((order) => ({
            id: order._id || order.id,

            customer:
              order.customerId?.name ||
              order.shippingAddress?.fullName ||
              "Customer",

            product:
              order.items?.[0]?.productId?.name ||
              order.items?.[0]?.productName ||
              "Order items",

            quantity:
              order.items?.reduce(
                (total, item) =>
                  total +
                  Number(item.quantity || 0),
                0
              ) || 0,

            amount: `₦${Number(
              order.totalAmount || 0
            ).toLocaleString()}`,

            date: order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "en-NG",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "N/A",

            status: formatStatus(
              order.status
            ),
          }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error(
          "Load vendor orders error:",
          err
        );

        setError(
          err.message ||
            "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setError("");

      await updateOrderStatus(
        orderId,
        newStatus.toLowerCase()
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Update order status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update order status."
      );
    }
  };

  const handleViewOrder = (order) => {
    navigate(
      `/vendor/orders/${order.id}`
    );
  };

  const filteredOrders =
    orders.filter((order) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        order.id
          .toLowerCase()
          .includes(search) ||
        order.customer
          .toLowerCase()
          .includes(search) ||
        order.product
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status === "Shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-orders-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Orders</h1>

            <p>
              Manage and track orders placed
              with your store.
            </p>
          </div>
        </div>

        <div className="order-summary-grid">
          <div className="order-summary-card">
            <div className="order-summary-icon">
              <ShoppingBag size={21} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>
                {orders.length}
              </strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon pending-icon">
              <Clock size={21} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {pendingOrders}
              </strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon shipped-icon">
              <Truck size={21} />
            </div>

            <div>
              <span>Shipped</span>

              <strong>
                {shippedOrders}
              </strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon delivered-icon">
              <CheckCircle2
                size={21}
              />
            </div>

            <div>
              <span>Delivered</span>

              <strong>
                {deliveredOrders}
              </strong>
            </div>
          </div>
        </div>

        <section className="dashboard-panel orders-management-panel">
          <div className="orders-toolbar">
            <div className="orders-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search order, customer or product..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </div>

            <select
              className="order-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Orders
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>
            </select>
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-products">
              <ShoppingBag size={35} />

              <h3>
                Loading orders...
              </h3>
            </div>
          ) : (
            <>
              <OrdersTable
                orders={
                  filteredOrders
                }
                onStatusChange={
                  handleStatusChange
                }
                onViewOrder={
                  handleViewOrder
                }
              />

              <div className="table-pagination">
                <span>
                  Showing{" "}
                  {
                    filteredOrders.length
                  }{" "}
                  of {orders.length}{" "}
                  orders
                </span>

                <div>
                  <button disabled>
                    Previous
                  </button>

                  <button className="pagination-active">
                    1
                  </button>

                  <button disabled>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorOrders;