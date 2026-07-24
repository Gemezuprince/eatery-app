import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

function MealDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/menu/${id}`);
        setMeal(response.data.data.item);
      } catch (err) {
        setError('Meal not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(meal._id, quantity);
    } catch (err) {
      console.error('Failed to add to cart', err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="p-8 text-brand-dark-200">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!meal) return null;

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {meal.image ? (
          <img src={meal.image} alt={meal.name} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-brand-light-200 flex items-center justify-center text-brand-dark-300">
            No image available
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-brand-dark">{meal.name}</h1>
          <p className="text-brand-dark-300 text-sm mt-1">{meal.category}</p>
          <p className="text-brand-dark-200 mt-4">{meal.description}</p>

          <div className="flex items-center gap-4 mt-6">
            <label className="text-sm font-medium text-brand-dark">Quantity</label>
            <div className="flex items-center border border-brand-dark-400 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-brand-dark font-bold"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-brand-dark font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-2xl font-bold text-brand-primary">₦{meal.price}</span>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealDetails;
