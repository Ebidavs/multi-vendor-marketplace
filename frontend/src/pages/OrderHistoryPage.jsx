import { useEffect, useState } from 'react';
import OrderCard from '../components/orders/OrderCard';
import OrderFilterBar from '../components/orders/OrderFilterBar';
import EmptyOrdersState from '../components/orders/EmptyOrdersState';
import { getOrders } from '../services/orderService';
import '../components/orders/orders.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError('Could not load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Order list has no product info, so search matches the order ID only.
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = search === '' || order._id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <p className="ord-message">Loading your orders...</p>;
  if (error) return <p className="ord-message ord-message--error">{error}</p>;

  return (
    <div className="ord-page">
      <h1 className="ord-title">My Orders</h1>

      <OrderFilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        searchTerm={search}
        onSearchChange={setSearch}
      />

      {filteredOrders.length === 0 ? (
        <EmptyOrdersState />
      ) : (
        filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
      )}
    </div>
  );
}