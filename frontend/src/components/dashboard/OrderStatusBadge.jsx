function OrderStatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span className={`product-status ${statusClass}`}>
      {status}
    </span>
  );
}

export default OrderStatusBadge;