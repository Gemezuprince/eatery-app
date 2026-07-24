import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function Cart() {
  const { cart, loading, updateCartItem, removeCartItem } = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce(
    (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
    0
  );

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  if (loading) {
    return <p className="p-8 text-brand-dark-200">Loading cart...</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-brand-light min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl text-brand-dark mb-4">Your cart is empty</p>
        <Link
          to="/menu"
          className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-100"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">Your Cart</h1>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >
              {item.menuItem?.image ? (
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-brand-light-200 rounded-lg flex items-center justify-center text-xs text-brand-dark-300">
                  No image
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold text-brand-dark">{item.menuItem?.name}</h3>
                <p className="text-brand-primary font-semibold">
                  ₦{item.menuItem?.price}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-brand-dark-400 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="px-3 py-1 text-brand-dark font-bold"
                    >
                      −
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="px-3 py-1 text-brand-dark font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-600 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-bold text-brand-dark">
                ₦{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between text-xl font-bold text-brand-dark">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-100 mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
