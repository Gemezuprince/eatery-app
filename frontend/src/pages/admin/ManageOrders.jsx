import { useState, useEffect } from 'react';
import api from '../../services/api';

const statuses = ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  'out for delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.data.orders);
    } catch (err) {
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Manage Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            statusFilter === ''
              ? 'bg-brand-primary text-white'
              : 'bg-white text-brand-dark border border-brand-dark-400'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
              statusFilter === status
                ? 'bg-brand-primary text-white'
                : 'bg-white text-brand-dark border border-brand-dark-400'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <p className="text-brand-dark-200">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-brand-dark-200">No orders found.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm text-brand-dark-300">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-brand-dark-300">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-sm text-brand-dark-200">
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <p className="text-sm text-brand-dark-200 mb-3">
              Delivery: {order.deliveryAddress}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-light-200 pt-3">
              <span className="text-sm text-brand-dark-300">
                Payment: <span className="capitalize">{order.paymentMethod}</span> (
                {order.paymentStatus})
              </span>
              <span className="font-bold text-brand-primary">
                ₦{order.totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-brand-dark mr-2">
                Update Status:
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                disabled={updatingId === order._id}
                className="border border-brand-dark-400 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageOrders;
