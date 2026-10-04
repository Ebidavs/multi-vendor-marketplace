
export default function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return <p className="ord-no-items">No items in this order.</p>;
  }

  return (
    <div className="ord-items">
      {items.map((item) => (
        <div key={item._id} className="ord-item">
          <img
            src={item.productId?.images?.[0] || '/placeholder-product.png'}
            alt={item.productId?.name || 'Product'}
            className="ord-item-img"
          />
          <div className="ord-item-info">
            <p className="ord-item-name">{item.productId?.name || 'Product'}</p>
            <p className="ord-item-meta">Qty: {item.quantity}</p>
          </div>
          <p className="ord-item-price">
            ₦{(item.priceAtPurchase * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}