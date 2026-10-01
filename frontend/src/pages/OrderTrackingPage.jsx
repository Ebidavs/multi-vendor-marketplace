import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import OrderProgressTracker from '../components/orders/OrderProgressTracker';
import OrderItemsList from '../components/orders/OrderItemsList';
import ReviewForm from '../components/orders/ReviewForm';
import { getOrderById, submitReview } from '../services/orderService';
import '../components/orders/orders.css';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => setError('Could not load this order.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleReviewSubmit = async ({ productId, rating, comment }) => {
    try {
      await submitReview(productId, { rating, comment });
      setReviewedProducts((prev) => [...prev, productId]);
    } catch {
      alert('Could not submit review. Please try again.');
    }
  };

  if (loading) return <p className="ord-message">Loading order details...</p>;
  if (error) return <p className="ord-message ord-message--error">{error}</p>;
  if (!order) return null;

  return (
    <div className="ord-page">
      <Link to="/orders" className="ord-back">
        &larr; Back to my orders
      </Link>

      <div className="ord-header">
        <div>
          <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="ord-subtitle">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderProgressTracker currentStatus={order.status} />

      <h2 className="ord-section-title">Items</h2>
      <OrderItemsList items={order.items} />

      <div className="ord-total-row">
        <span>Total</span>
        <strong>₦{order.total.toLocaleString()}</strong>
      </div>

      {order.status === 'delivered' && (
        <div>
          <h2 className="ord-section-title">Rate your items</h2>
          {order.items.map((item) =>
            reviewedProducts.includes(item.productId) ? (
              <p key={item.productId} className="ord-reviewed">
                ✓ You reviewed {item.name}
              </p>
            ) : (
              <div key={item.productId} className="ord-review-item">
                <p className="ord-review-product">{item.name}</p>
                <ReviewForm productId={item.productId} onSubmit={handleReviewSubmit} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}