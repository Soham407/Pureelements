import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../CartContext';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

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
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FFFBF2]">
          <h2 className="font-serif text-2xl text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-[#8B7E66]" />
            Your Cart ({cart.length})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
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
                className="mt-4 px-6 py-2 bg-[#8B7E66] text-white text-sm uppercase font-bold tracking-wider hover:bg-[#7A6D55] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
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
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-gray-50 text-gray-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-gray-50 text-gray-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
              className="w-full bg-[#2C2C2C] text-white py-4 uppercase font-bold tracking-widest text-sm hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
              onClick={() => alert('Proceeding to Checkout...')}
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