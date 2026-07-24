import { useState, useEffect } from 'react';
import api from '../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  'out for delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.data.orders);
      } catch (err) {
        setError('Could not load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-8 text-brand-dark-200">Loading your orders...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-brand-dark-200">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-brand-dark-300">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-brand-dark-300">
                      {new Date(order.createdAt).toLocaleDateString()}
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

                <div className="flex items-center justify-between border-t border-brand-dark-400 pt-3">
                  <span className="text-sm text-brand-dark-300">
                    Payment: <span className="capitalize">{order.paymentMethod}</span> ({order.paymentStatus})
                  </span>
                  <span className="font-bold text-brand-primary">
                    ₦{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
