import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Eye,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
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
      status: "Cancelled",
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

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.product.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-orders-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Orders</h1>
            <p>Manage and track orders placed with your store.</p>
          </div>
        </div>

        <div className="order-summary-grid">
          <div className="order-summary-card">
            <div className="order-summary-icon">
              <ShoppingBag size={21} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>42</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon pending-icon">
              <Clock size={21} />
            </div>

            <div>
              <span>Pending</span>
              <strong>6</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon shipped-icon">
              <Truck size={21} />
            </div>

            <div>
              <span>Shipped</span>
              <strong>8</strong>
            </div>
          </div>

          <div className="order-summary-card">
            <div className="order-summary-icon delivered-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Delivered</span>
              <strong>28</strong>
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
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              className="order-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table className="vendor-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="vendor-order-id">{order.id}</td>

                    <td>
                      <div className="order-customer">
                        <div className="customer-avatar">
                          {order.customer
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span>{order.customer}</span>
                      </div>
                    </td>

                    <td>{order.product}</td>

                    <td>{order.quantity}</td>

                    <td className="vendor-order-amount">{order.amount}</td>

                    <td>{order.date}</td>

                    <td>
                      <select
                        className={`order-status-select ${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>

                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="view-order-button"
                        title="View order"
                        onClick={() =>
                          navigate(
                            `/vendor/orders/${order.id.replace("#", "")}`,
                          )
                        }
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="empty-orders">
              <ShoppingBag size={36} />

              <h3>No orders found</h3>

              <p>No orders match your current search or filter.</p>
            </div>
          )}

          <div className="table-pagination">
            <span>Showing {filteredOrders.length} of 42 orders</span>

            <div>
              <button disabled>Previous</button>

              <button className="pagination-active">1</button>

              <button>2</button>
              <button>3</button>
              <button>Next</button>
            </div>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorOrders;
