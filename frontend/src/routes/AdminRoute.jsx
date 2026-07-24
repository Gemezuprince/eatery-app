import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-8 text-brand-dark-200">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
