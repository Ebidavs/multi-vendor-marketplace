import {
  Eye,
  ShoppingBag,
} from "lucide-react";

import OrderStatusUpdater from "./OrderStatusUpdater";

function OrdersTable({
  orders,
  onStatusChange,
  onViewOrder,
}) {
  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <ShoppingBag size={36} />

        <h3>No orders found</h3>

        <p>
          No orders match your current search or filter.
        </p>
      </div>
    );
  }

  return (
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
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="vendor-order-id">
                {order.id}
              </td>

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

              <td className="vendor-order-amount">
                {order.amount}
              </td>

              <td>{order.date}</td>

              <td>
                <OrderStatusUpdater
                  orderId={order.id}
                  status={order.status}
                  onStatusChange={onStatusChange}
                />
              </td>

              <td>
                <button
                  type="button"
                  className="view-order-button"
                  title="View order"
                  onClick={() => onViewOrder(order)}
                >
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;