import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../hooks/useCart';
import api from '../services/api';

function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const total = cart.items.reduce(
    (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
    0
  );

  const onSubmit = async (data) => {
    setError('');
    try {
      const response = await api.post('/orders', {
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
      });

      await fetchCart();

      if (data.paymentMethod === 'card' && response.data.data.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        navigate('/my-orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order.');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-brand-light min-h-screen flex items-center justify-center px-4">
        <p className="text-brand-dark text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-6">Checkout</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Delivery Address
              </label>
              <textarea
                rows="3"
                {...register('deliveryAddress', { required: 'Delivery address is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.deliveryAddress && (
                <p className="text-red-600 text-xs mt-1">{errors.deliveryAddress.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Payment Method
              </label>
              <select
                {...register('paymentMethod', { required: 'Payment method is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Select a payment method</option>
                <option value="cash">Cash on Delivery</option>
                <option value="card">Card (Pay Online)</option>
                <option value="transfer">Bank Transfer</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-red-600 text-xs mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
            >
              {isSubmitting ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold text-brand-dark mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-brand-dark-200">
                <span>
                  {item.menuItem?.name} × {item.quantity}
                </span>
                <span>₦{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-dark-400 mt-4 pt-4 flex justify-between font-bold text-brand-dark">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
