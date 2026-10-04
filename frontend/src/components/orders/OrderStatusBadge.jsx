const KNOWN = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusBadge({ status }) {
  const variant = KNOWN.includes(status) ? status : 'default';

  return <span className={`ord-badge ord-badge--${variant}`}>{status}</span>;
}