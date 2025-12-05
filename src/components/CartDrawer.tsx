import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types';

interface Props {
  onCheckout: () => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { setQuantity, removeFromCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  
  // Sync local state with prop when prop changes (e.g. from other sources),
  // but only if we are not currently debouncing a change? 
  // Actually, simpler: just sync if the difference is large or if it's a fresh mount.
  // But if we are typing/clicking fast, we don't want prop updates to overwrite local state immediately if they are lagging.
  // However, since we do optimistic updates in context, prop should update fast.
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const debouncedQuantity = useDebounce(localQuantity, 500);

  useEffect(() => {
    // Only trigger update if the debounced value is different from the actual item quantity
    // and if it's valid.
    if (debouncedQuantity !== item.quantity && debouncedQuantity > 0) {
      setQuantity(item.id, debouncedQuantity);
    }
  }, [debouncedQuantity, item.id, item.quantity, setQuantity]);

  const handleIncrement = () => setLocalQuantity(prev => prev + 1);
  const handleDecrement = () => setLocalQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="flex gap-4 group">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-serif text-base font-medium text-gray-800 line-clamp-2 pr-4">
              {item.name}
            </h3>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{item.category}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Control */}
          <div className="flex items-center border border-gray-200 rounded-sm">
            <button 
              onClick={handleDecrement}
              className="p-1.5 hover:bg-gray-50 text-gray-500 disabled:opacity-50"
              aria-label="Decrease quantity"
              disabled={localQuantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-700">{localQuantity}</span>
            <button 
              onClick={handleIncrement}
              className="p-1.5 hover:bg-gray-50 text-gray-500"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-gray-900">₹{(item.price * localQuantity).toLocaleString('en-IN')}</p>
            {localQuantity > 1 && (
              <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartDrawer: React.FC<Props> = ({ onCheckout }) => {
  const { cart, isCartOpen, closeCart } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      // Focus close button when drawer opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isCartOpen]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Prevent scrolling on body when cart is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-surface">
          <h2 className="font-serif text-2xl text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-brand-primary" />
            Your Cart ({cart.length})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Close cart"
            ref={closeButtonRef}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-brand-primary text-white text-sm uppercase font-bold tracking-wider hover:bg-brand-primary/90 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-[#FAFAFA] p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-serif font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              className="w-full bg-brand-dark text-white py-4 uppercase font-bold tracking-widest text-sm hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
              onClick={onCheckout}
            >
              Checkout <span className="font-normal opacity-75">| ₹{subtotal.toLocaleString('en-IN')}</span>
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Tax included. Shipping calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
