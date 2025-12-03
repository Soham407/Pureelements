
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Order, Address } from '../types';
import { ChevronRight, CreditCard, Truck, CheckCircle, ArrowRight, MapPin, Plus } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { ordersService, addressesService } from '../lib/database';
import useRazorpay from '../hooks/useRazorpay';

// Zod schema for checkout form validation
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10,12}$/, 'Phone number must be 10-12 digits').refine(
    (val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 12;
    },
    { message: 'Phone number must be 10-12 digits' }
  ),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'Please select a state'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  paymentMethod: z.enum(['UPI', 'CARD', 'COD'] as [string, ...string[]]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface Props {
  onNavigateHome: () => void;
  onPlaceOrder?: (order: Order) => void;
}

const CheckoutPage: React.FC<Props> = ({ onNavigateHome, onPlaceOrder }) => {
  const { cart, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const isRazorpayLoaded = useRazorpay();
  
  // Address Selection State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  React.useEffect(() => {
    if (user) {
      addressesService.getAll(user.id).then(addresses => {
        setSavedAddresses(addresses);
        // Auto-select default address if available
        const defaultAddr = addresses.find(a => a.isDefault);
        if (defaultAddr) {
          handleSelectAddress(defaultAddr);
        } else if (addresses.length > 0) {
           // If no default, but addresses exist, maybe select first? Or let user choose.
           // Let's not auto-select non-default to avoid confusion, or select first one.
           // handleSelectAddress(addresses[0]); 
        }
      });
    }
  }, [user]);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setShowAddressForm(false);
    // Fill form
    setValue('fullName', address.fullName);
    setValue('phone', address.phone);
    setValue('address', address.addressLine1 + (address.addressLine2 ? ', ' + address.addressLine2 : ''));
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pincode', address.pincode);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setShowAddressForm(true);
    // Clear form except email/name from profile if needed, but maybe better to keep blank or current
    setValue('address', '');
    setValue('city', '');
    setValue('state', '');
    setValue('pincode', '');
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'UPI'
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      showToast('Please login to place an order', 'error');
      return;
    }

    setLoading(true);

    try {
      // Create order items
      const orderItems = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));

      // Create order in Supabase
      // For online payments, we create as 'Pending' first
      // For COD, we can set as 'Processing'
      const initialStatus = data.paymentMethod === 'COD' ? 'Processing' : 'Pending';

      const newOrder = await ordersService.create({
        user_id: user.id,
        total: total,
        status: initialStatus as any, // Cast to any if 'Pending' is not in strict type yet
        items: orderItems,
        shipping_address: data.address,
        shipping_city: data.city,
        shipping_state: data.state,
        shipping_pincode: data.pincode,
        payment_method: data.paymentMethod
      });

      const handleSuccess = async () => {
        setPlacedOrderId(newOrder.id);
        if (onPlaceOrder) {
          onPlaceOrder(newOrder);
        }
        setIsOrderPlaced(true);
        showToast('Order placed successfully!', 'success');
        await clearCart();
      };

      if (data.paymentMethod === 'COD') {
        await handleSuccess();
      } else {
        // Online Payment (UPI/CARD)
        if (!isRazorpayLoaded) {
          showToast('Razorpay SDK not loaded. Please check your internet connection.', 'error');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: total * 100, // Amount in paise
          currency: "INR",
          name: "Pure Elements",
          description: "Order Payment",
          image: "https://via.placeholder.com/150", // Placeholder logo
          order_id: "", // In a real app, generate Razorpay Order ID on backend
          handler: async function (response: any) {
            // Payment Success
            try {
              // Update order status to Processing
              await ordersService.updateStatus(newOrder.id, 'Processing' as any);
              await handleSuccess();
            } catch (err) {
              console.error('Error updating order status:', err);
              showToast('Payment successful but failed to update order. Please contact support.', 'error');
            }
          },
          prefill: {
            name: data.fullName,
            email: data.email,
            contact: data.phone
          },
          notes: {
            address: data.address
          },
          theme: {
            color: "#8B7E66"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              showToast('Payment cancelled', 'info');
            }
          }
        };
        
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
          showToast(response.error.description || 'Payment failed', 'error');
          setLoading(false);
        });
        rzp1.open();
        // Don't set loading false here, wait for handler or dismiss
        return; 
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      showToast(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      if (data.paymentMethod === 'COD') {
        setLoading(false);
      }
    }
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
             <p className="font-mono text-gray-800 font-bold">{placedOrderId}</p>
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
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                   <Truck className="text-[#8B7E66]" />
                   <h2 className="font-serif text-xl font-bold text-gray-800">Shipping Details</h2>
                </div>

                {/* Saved Addresses Selection */}
                {savedAddresses.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Select Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {savedAddresses.map(addr => (
                        <div 
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`border p-4 rounded-sm cursor-pointer transition-all relative ${selectedAddressId === addr.id ? 'border-[#8B7E66] bg-[#FFFBF2] ring-1 ring-[#8B7E66]' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          {addr.isDefault && <span className="absolute top-2 right-2 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">Default</span>}
                          <p className="font-bold text-gray-800 text-sm">{addr.fullName}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {addr.addressLine1}, {addr.city}
                          </p>
                          <p className="text-xs text-gray-600">{addr.pincode}</p>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className={`border border-dashed p-4 rounded-sm flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#8B7E66] hover:border-[#8B7E66] transition-colors ${showAddressForm ? 'border-[#8B7E66] text-[#8B7E66] bg-gray-50' : 'border-gray-300'}`}
                      >
                        <Plus size={20} />
                        <span className="text-xs font-bold uppercase">Add New Address</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${(savedAddresses.length > 0 && !showAddressForm && selectedAddressId) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                      <input {...register('fullName')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="John Doe" />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                      <input {...register('phone')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                      <input type="email" {...register('email')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="john@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                      <input {...register('address')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="Flat No, Building, Street" />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                      <input {...register('city')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="Pune" />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                      <input {...register('pincode')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="411001" />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                      <select {...register('state')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white">
                         <option value="">Select State</option>
                         <option value="Maharashtra">Maharashtra</option>
                         <option value="Delhi">Delhi</option>
                         <option value="Karnataka">Karnataka</option>
                         <option value="Gujarat">Gujarat</option>
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
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
                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
                      <input type="radio" value="UPI" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">UPI (Google Pay / PhonePe)</span>
                         <p className="text-xs text-gray-500">Instant payment via QR Code</p>
                      </div>
                   </label>

                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
                      <input type="radio" value="CARD" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">Credit / Debit Card</span>
                         <p className="text-xs text-gray-500">Visa, Mastercard, Rupay</p>
                      </div>
                   </label>

                   <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
                      <input type="radio" value="COD" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
                      <div>
                         <span className="font-bold text-gray-800">Cash on Delivery</span>
                         <p className="text-xs text-gray-500">Pay when you receive the order</p>
                      </div>
                   </label>
                   {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}
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
