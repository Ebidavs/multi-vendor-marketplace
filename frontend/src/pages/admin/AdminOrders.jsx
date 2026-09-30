import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Eye,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const orders = [
    {
      id: "#MKT1032",
      customer: "David Johnson",
      vendor: "TechHub Store",
      amount: "₦85,000",
      date: "Sep 30, 2026",
      status: "Delivered",
    },
    {
      id: "#MKT1031",
      customer: "Sarah Williams",
      vendor: "Urban Fashion",
      amount: "₦58,000",
      date: "Sep 30, 2026",
      status: "Processing",
    },
    {
      id: "#MKT1030",
      customer: "Michael James",
      vendor: "Home Essentials",
      amount: "₦120,500",
      date: "Sep 29, 2026",
      status: "Shipped",
    },
    {
      id: "#MKT1029",
      customer: "Grace Peter",
      vendor: "TechHub Store",
      amount: "₦45,000",
      date: "Sep 29, 2026",
      status: "Pending",
    },
    {
      id: "#MKT1028",
      customer: "Daniel Thomas",
      vendor: "Beauty Corner",
      amount: "₦32,500",
      date: "Sep 28, 2026",
      status: "Cancelled",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customer} ${order.vendor}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Orders</h1>
            <p>
              Monitor transactions and order activity across all
              MarketHub vendors.
            </p>
          </div>
        </div>

        <div className="admin-order-stats">
          <OrderStat
            icon={ShoppingBag}
            title="Total Orders"
            value="1,327"
          />

          <OrderStat
            icon={Clock}
            title="Pending"
            value="38"
            type="orange"
          />

          <OrderStat
            icon={Truck}
            title="In Transit"
            value="74"
            type="blue"
          />

          <OrderStat
            icon={CheckCircle2}
            title="Delivered"
            value="1,185"
            type="green"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
                      <button className="admin-icon-button">
                        <Eye size={16} />
                      </button>
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

function OrderStat({ icon: Icon, title, value, type = "purple" }) {
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