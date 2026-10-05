import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  Truck,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorOrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [status, setStatus] = useState("Processing");

  const order = {
    id: orderId || "MKT1023",
    customer: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+234 801 234 5678",
    },
    delivery: {
      address: "24 Market Street",
      city: "Port Harcourt",
      state: "Rivers State",
      country: "Nigeria",
    },
    items: [
      {
        id: 1,
        name: "Smart Watch",
        sku: "MKT-SW-001",
        price: 85000,
        quantity: 1,
      },
    ],
    payment: {
      method: "Card Payment",
      status: "Paid",
      subtotal: 85000,
      deliveryFee: 2500,
      total: 87500,
    },
    date: "September 29, 2026",
  };

  const formatPrice = (price) =>
    `₦${price.toLocaleString()}`;

  return (
    <DashboardLayout role="vendor">
      <section className="order-details-page">
        <div className="order-details-heading">
          <div className="order-heading-left">
            <button
              className="back-button"
              onClick={() => navigate("/vendor/orders")}
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Order #{order.id}</h1>
              <p>Placed on {order.date}</p>
            </div>
          </div>

          <div className="order-status-control">
            <span>Order Status</span>

            <select
              className={`order-status-select ${status.toLowerCase()}`}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="order-details-layout">
          <div className="order-details-main">
            <section className="dashboard-panel order-items-card">
              <div className="panel-heading">
                <div>
                  <h2>Order Items</h2>
                  <p>Products included in this order</p>
                </div>

                <Package size={20} />
              </div>

              <div className="order-items-list">
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.id}
                  >
                    <div className="order-product-image">
                      <Package size={24} />
                    </div>

                    <div className="order-product-information">
                      <strong>{item.name}</strong>
                      <span>SKU: {item.sku}</span>
                    </div>

                    <div className="order-item-quantity">
                      Qty: {item.quantity}
                    </div>

                    <div className="order-item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>Customer Information</h2>
                  <p>Customer contact details</p>
                </div>

                <User size={20} />
              </div>

              <div className="customer-details-grid">
                <div className="detail-information">
                  <User size={18} />

                  <div>
                    <span>Customer</span>
                    <strong>
                      {order.customer.name}
                    </strong>
                  </div>
                </div>

                <div className="detail-information">
                  <Mail size={18} />

                  <div>
                    <span>Email Address</span>
                    <strong>
                      {order.customer.email}
                    </strong>
                  </div>
                </div>

                <div className="detail-information">
                  <Phone size={18} />

                  <div>
                    <span>Phone Number</span>
                    <strong>
                      {order.customer.phone}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>Delivery Information</h2>
                  <p>Where this order should be delivered</p>
                </div>

                <Truck size={20} />
              </div>

              <div className="delivery-information">
                <MapPin size={20} />

                <div>
                  <span>Delivery Address</span>

                  <strong>
                    {order.delivery.address}
                  </strong>

                  <p>
                    {order.delivery.city},{" "}
                    {order.delivery.state},{" "}
                    {order.delivery.country}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="order-details-sidebar">
            <section className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>Payment Summary</h2>
                  <p>Order payment information</p>
                </div>

                <CreditCard size={20} />
              </div>

              <div className="payment-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatPrice(
                      order.payment.subtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>Delivery Fee</span>
                  <strong>
                    {formatPrice(
                      order.payment.deliveryFee
                    )}
                  </strong>
                </div>

                <div className="payment-total">
                  <span>Total</span>
                  <strong>
                    {formatPrice(
                      order.payment.total
                    )}
                  </strong>
                </div>
              </div>

              <div className="payment-information">
                <div>
                  <span>Payment Method</span>
                  <strong>
                    {order.payment.method}
                  </strong>
                </div>

                <div>
                  <span>Payment Status</span>

                  <strong className="payment-paid">
                    {order.payment.status}
                  </strong>
                </div>
              </div>
            </section>

            <section className="dashboard-panel order-action-card">
              <h3>Manage Order</h3>

              <p>
                Update the order status as you process
                and deliver this customer's order.
              </p>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
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

              <button
                onClick={() =>
                  alert(
                    `Order status updated to ${status}`
                  )
                }
              >
                Update Order
              </button>
            </section>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default VendorOrderDetails;