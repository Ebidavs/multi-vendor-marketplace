import { useState } from "react";
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
import "./vendor.css";

function VendorOrders() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [orders, setOrders] = useState([
    {
      id: "#MKT1024",
      customer: "David Johnson",
      product: "Wireless Headphones",
      quantity: 1,
      amount: "₦45,000",
      date: "Sep 29, 2026",
      status: "Delivered",
    },
    {
      id: "#MKT1023",
      customer: "Sarah Williams",
      product: "Smart Watch",
      quantity: 1,
      amount: "₦85,000",
      date: "Sep 29, 2026",
      status: "Processing",
    },
    {
      id: "#MKT1022",
      customer: "Michael James",
      product: "Laptop Backpack",
      quantity: 2,
      amount: "₦57,000",
      date: "Sep 28, 2026",
      status: "Shipped",
    },
    {
      id: "#MKT1021",
      customer: "Grace Peter",
      product: "Bluetooth Speaker",
      quantity: 1,
      amount: "₦32,000",
      date: "Sep 28, 2026",
      status: "Pending",
    },
    {
      id: "#MKT1020",
      customer: "Daniel Thomas",
      product: "Running Sneakers",
      quantity: 1,
      amount: "₦58,000",
      date: "Sep 27, 2026",
      status: "Pending",
    },
  ]);

  const handleStatusChange = (
    orderId,
    newStatus
  ) => {
    // Temporary frontend update.
    // Later this will call the backend status endpoint.
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
  };

  const handleViewOrder = (order) => {
    const orderId = order.id.replace("#", "");

    navigate(`/vendor/orders/${orderId}`);
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.product.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-orders-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Orders</h1>

            <p>
              Manage and track orders placed with your
              store.
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
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon pending-icon">
              <Clock size={21} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingOrders}</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon shipped-icon">
              <Truck size={21} />
            </div>

            <div>
              <span>Shipped</span>
              <strong>{shippedOrders}</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon delivered-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Delivered</span>
              <strong>{deliveredOrders}</strong>
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
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select
              className="order-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">
                Processing
              </option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">
                Delivered
              </option>
            </select>
          </div>

          <OrdersTable
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
            onViewOrder={handleViewOrder}
          />

          <div className="table-pagination">
            <span>
              Showing {filteredOrders.length} of{" "}
              {orders.length} orders
            </span>

            <div>
              <button disabled>Previous</button>

              <button className="pagination-active">
                1
              </button>

              <button>Next</button>
            </div>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorOrders;