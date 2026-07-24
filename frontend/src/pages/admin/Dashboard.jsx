import { useState, useEffect } from 'react';
import api from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (err) {
        setError('Could not load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-brand-dark-200">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toFixed(2)}` },
    { label: 'Pending Orders', value: stats.ordersByStatus.pending },
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Menu Items', value: stats.totalMenuItems },
  ];

  const statusEntries = Object.entries(stats.ordersByStatus);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-brand-dark-300">{card.label}</p>
            <p className="text-2xl font-bold text-brand-primary mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-brand-dark mb-4">Orders by Status</h2>
        <div className="space-y-2">
          {statusEntries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="capitalize text-brand-dark-200">{status}</span>
              <span className="font-semibold text-brand-dark">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
