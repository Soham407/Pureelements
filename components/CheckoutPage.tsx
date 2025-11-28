
import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { CheckoutDetails } from '../types';
import { ChevronRight, CreditCard, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../ToastContext';

interface Props {
  onNavigateHome: () => void;
}

const CheckoutPage: React.FC<Props> = ({ onNavigateHome }) => {
  const { cart, cartCount } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const [formData, setFormData] = useState<CheckoutDetails>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'UPI'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsOrderPlaced(true);
      showToast('Order placed successfully!', 'success');
      // In a real app, clear cart here
    }, 2000);
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl max-w-lg w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="font-serif text-3xl text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for shopping with Pure Elements. Your order has been placed successfully and will be shipped soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-sm mb-8 text-left">
             <p className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Order ID</p>
             <p className="font-mono text-gray-800 font-bold">ORD-{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <button 
            onClick={onNavigateHome}
            className="bg-[#8B7E66] text-white px-8 py-3 uppercase font-bold tracking-widest text-sm hover:bg-[#7A6D55] transition-colors w-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
        <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center">
            <div className="text-center">
                <h2 className="font-serif text-2xl text-gray-800 mb-4">Your cart is empty</h2>
                <button onClick={onNavigateHome} className="text-[#8B7E66] font-bold hover:underline">
                    Go back to shop
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-[#FFFBF2] min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-8 text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                   <Truck className="text-[#8B7E66]" />
                   <h2 className="font-serif text-xl font-bold text-gray-800">Shipping Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="John Doe" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="+91 98765 43210" />
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="john@example.com" />
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                      <input required name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="Flat No, Building, Street" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                      <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="Pune" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                      <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none" placeholder="411001" />
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                      <select required name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white">
                         <option value="">Select State</option>
                         <option value="Maharashtra">Maharashtra</option>
                         <option value="Delhi">Delhi</option>
                         <option value="Karnataka">Karnataka</option>
                         <option value="Gujarat">Gujarat</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                   <CreditCard className="text-[#8B7E66]" />
                   <h2 className="font-serif text-xl font-bold text-gray-800">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${formData.paymentMethod === 'UPI' ? 'border-[#8B7E66] bg-[#FFFBF2]' : 'border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">UPI (Google Pay / PhonePe)</span>
                         <p className="text-xs text-gray-500">Instant payment via QR Code</p>
                      </div>
                   </label>

                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${formData.paymentMethod === 'CARD' ? 'border-[#8B7E66] bg-[#FFFBF2]' : 'border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="CARD" checked={formData.paymentMethod === 'CARD'} onChange={handleChange} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">Credit / Debit Card</span>
                         <p className="text-xs text-gray-500">Visa, Mastercard, Rupay</p>
                      </div>
                   </label>

                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-[#8B7E66] bg-[#FFFBF2]' : 'border-gray-200'}`}>
                      <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">Cash on Delivery</span>
                         <p className="text-xs text-gray-500">Pay when you receive the order</p>
                      </div>
                   </label>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
             <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm sticky top-24">
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
                   {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                         <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} x ₹{item.price}</p>
                         </div>
                         <div className="font-bold text-sm text-gray-800">
                            ₹{(item.price * item.quantity).toLocaleString()}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-4 mb-6">
                   <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                   </div>
                   <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                      <span>Total Amount</span>
                      <span>₹{total.toLocaleString()}</span>
                   </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                  className="w-full bg-[#2C2C2C] text-white py-4 uppercase font-bold tracking-widest text-xs hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (
                    <>
                        Place Order <ArrowRight size={16} />
                    </>
                  )}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
