function OrderStatusUpdater({
  orderId,
  status,
  onStatusChange,
}) {
  const handleChange = (event) => {
    onStatusChange(orderId, event.target.value);
  };

  return (
    <select
      className={`order-status-select ${status.toLowerCase()}`}
      value={status}
      onChange={handleChange}
    >
      <option value="Pending">Pending</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
    </select>
  );
}

export default OrderStatusUpdater;