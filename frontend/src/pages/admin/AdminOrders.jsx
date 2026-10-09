
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Admin-wide order retrieval is not yet
  // supported by the documented backend API.
  const orders = [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      `${order.id} ${order.customer} ${order.vendor}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Orders</h1>
            <p>
              Monitor transactions and order activity
              across all Xi Market vendors.
            </p>
          </div>
        </div>

        <div className="admin-order-stats">
          <OrderStat
            icon={ShoppingBag}
            title="Total Orders"
            value="—"
          />

          <OrderStat
            icon={Clock}
            title="Pending"
            value="—"
            type="orange"
          />

          <OrderStat
            icon={Truck}
            title="In Transit"
            value="—"
            type="blue"
          />

          <OrderStat
            icon={CheckCircle2}
            title="Delivered"
            value="—"
            type="green"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">
                All Statuses
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
              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>
                    <td>{order.vendor}</td>

                    <td>
                      <strong>{order.amount}</strong>
                    </td>

                    <td>{order.date}</td>

                    <td>
                      <span
                        className={`admin-status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <span>—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
            }}
          >
            <ShoppingBag
              size={38}
              style={{
                opacity: 0.4,
                marginBottom: "12px",
              }}
            />

            <h3>
              Order information unavailable
            </h3>

            <p>
              The backend does not currently
              provide an admin-wide orders endpoint.
            </p>

            <p>
              Once the endpoint is available,
              orders and statistics can be
              displayed here automatically.
            </p>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

function OrderStat({
  icon: Icon,
  title,
  value,
  type = "purple",
}) {
  return (
    <article className={`admin-order-stat ${type}`}>
      <div className="admin-order-stat-icon">
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default AdminOrders;
