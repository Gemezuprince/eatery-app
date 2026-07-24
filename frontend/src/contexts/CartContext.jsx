import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/cart');
      setCart(response.data.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const addToCart = async (menuItemId, quantity = 1) => {
    const response = await api.post('/cart', { menuItem: menuItemId, quantity });
    setCart(response.data.data.cart);
  };

  const updateCartItem = async (itemId, quantity) => {
    const response = await api.patch(`/cart/${itemId}`, { quantity });
    setCart(response.data.data.cart);
  };

  const removeCartItem = async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    setCart(response.data.data.cart);
  };

  const clearCart = async () => {
    const response = await api.delete('/cart');
    setCart(response.data.data.cart);
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, addToCart, updateCartItem, removeCartItem, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
