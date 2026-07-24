import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const categories = [
    'Main meals',
    'Protein & sides',
    'Drinks & beverages',
    'Desserts & snacks',
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/menu');
        setItems(response.data.data.items || []);
      } catch (err) {
        setError('Could not load the menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const itemName = (item.name || '').toLowerCase();
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch = searchTerm === '' || itemName.includes(searchTerm);
    const matchesCategory = category === '' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === category) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleAddToCart = async (itemId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingId(itemId);
    try {
      await addToCart(itemId, 1);
    } catch (err) {
      console.error('Failed to add to cart', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">Our Menu</h1>

        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={handleSearchChange}
          className="w-full border border-brand-dark-400 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                category === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-brand-dark border border-brand-dark-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="text-brand-dark-200">Loading menu...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredItems.length === 0 && (
          <p className="text-brand-dark-200">No meals match your search.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link to={`/menu/${item._id}`}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-brand-light-200 flex items-center justify-center text-brand-dark-300">
                    No image
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/menu/${item._id}`}>
                  <h3 className="font-bold text-brand-dark hover:text-brand-primary">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-brand-dark-200 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-brand-primary">₦{item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    disabled={addingId === item._id}
                    className="bg-brand-primary text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
                  >
                    {addingId === item._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
