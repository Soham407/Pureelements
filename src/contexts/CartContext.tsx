import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { cartService } from '../lib/database';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, delta: number) => Promise<void>;
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from Supabase when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !user) {
        setCart([]);
        return;
      }

      setIsLoading(true);
      try {
        const cartData = await cartService.getCart(user.id);
        const cartItems: CartItem[] = cartData.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        setCart(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !user) {
      // For non-authenticated users, use localStorage as fallback
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevCart, { ...product, quantity: quantity }];
      });
      return;
    }

    try {
      await cartService.addToCart(user.id, product.id, quantity);
      // Reload cart
      const cartData = await cartService.getCart(user.id);
      const cartItems: CartItem[] = cartData.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCart(cartItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated || !user) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      return;
    }

    try {
      await cartService.removeFromCart(user.id, productId);
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: number, delta: number) => {
    if (!isAuthenticated || !user) {
      setCart((prevCart) => 
        prevCart.map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        }).filter(item => item.quantity > 0)
      );
      return;
    }

    try {
      const currentItem = cart.find(item => item.id === productId);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + delta;
      if (newQuantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      await cartService.updateQuantity(user.id, productId, newQuantity);
      setCart((prevCart) => 
        prevCart.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const setQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!isAuthenticated || !user) {
      setCart((prevCart) => 
        prevCart.map((item) => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      // Optimistic update
      setCart((prevCart) => 
        prevCart.map((item) => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
      await cartService.updateQuantity(user.id, productId, quantity);
    } catch (error) {
      console.error('Error setting quantity:', error);
      // Revert on error (simplified, ideally would fetch fresh cart)
      const cartData = await cartService.getCart(user.id);
      const cartItems: CartItem[] = cartData.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCart(cartItems);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      return;
    }

    try {
      await cartService.clearCart(user.id);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      setQuantity,
      clearCart,
      cartCount, 
      isCartOpen, 
      openCart, 
      closeCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};