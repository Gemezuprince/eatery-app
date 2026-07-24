import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-light">
      <aside className="bg-brand-dark text-white w-full md:w-64 md:min-h-screen p-6">
        <Link to="/admin/dashboard" className="text-xl font-bold text-brand-primary block mb-8">
          Savora Admin
        </Link>

        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded-lg hover:bg-brand-dark-100 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/menu"
            className="block px-3 py-2 rounded-lg hover:bg-brand-dark-100 font-medium"
          >
            Manage Menu
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 rounded-lg hover:bg-brand-dark-100 font-medium"
          >
            Manage Orders
          </Link>
        </nav>

        <div className="mt-10 pt-6 border-t border-brand-dark-100">
          <p className="text-sm text-brand-dark-400 mb-2">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-brand-primary font-semibold"
          >
            Logout
          </button>
          <Link
            to="/"
            className="block text-sm text-brand-dark-400 mt-2 hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
