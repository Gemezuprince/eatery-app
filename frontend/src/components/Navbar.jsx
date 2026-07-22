import { Link } from 'react-router-dom';

function Navbar() {
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
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-brand-dark hover:text-brand-primary font-medium">
            Cart
          </Link>
          <Link
            to="/login"
            className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary-100"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
