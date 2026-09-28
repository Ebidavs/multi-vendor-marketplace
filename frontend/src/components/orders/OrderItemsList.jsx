export default function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return <p className="ord-no-items">No items in this order.</p>;
  }

  return (
    <div className="ord-items">
      {items.map((item) => (
        <div key={item.productId} className="ord-item">
          <img
            src={item.image || '/placeholder-product.png'}
            alt={item.name}
            className="ord-item-img"
          />
          <div className="ord-item-info">
            <p className="ord-item-name">{item.name}</p>
            <p className="ord-item-meta">{item.vendor}</p>
            <p className="ord-item-meta">Qty: {item.quantity}</p>
          </div>
          <p className="ord-item-price">₦{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}