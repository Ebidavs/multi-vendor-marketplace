import { Link } from 'react-router-dom';

export default function EmptyOrdersState() {
  return (
    <div className="ord-empty">
      <div className="ord-empty-icon">🛍️</div>
      <h3>No orders yet</h3>
      <p>When you place an order, it will show up here.</p>
      <Link to="/products" className="ord-btn">
        Start Shopping
      </Link>
    </div>
  );
}