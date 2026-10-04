import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';


export default function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order._id}`} className="ord-card">
      <div className="ord-card-top">
        <div>
          <p className="ord-card-id">Order #{order._id.slice(-6).toUpperCase()}</p>
          <p className="ord-card-date">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="ord-card-bottom">
        <span className="ord-card-count">View details</span>
        <span className="ord-card-total">₦{order.totalAmount.toLocaleString()}</span>
      </div>
    </Link>
  );
}