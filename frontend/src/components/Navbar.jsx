import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-primary">
          Savora
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-brand-dark hover:text-brand-primary font-medium">
            Home
          </Link>
          <Link to="/menu" className="text-brand-dark hover:text-brand-primary font-medium">
            Menu
          </Link>
          <Link to="/about" className="text-brand-dark hover:text-brand-primary font-medium">
            About
          </Link>
          <Link to="/contact" className="text-brand-dark hover:text-brand-primary font-medium">
            Contact
          </Link>
          {user && (
            <Link to="/my-orders" className="text-brand-dark hover:text-brand-primary font-medium">
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-brand-dark hover:text-brand-primary font-medium">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-brand-dark hover:text-brand-primary font-medium">
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-brand-dark hover:text-brand-primary font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
