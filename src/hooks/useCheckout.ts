import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ordersService, addressesService } from '../lib/database';
import { supabase } from '../lib/supabase';
import useRazorpay from './useRazorpay';
import { Address, Order } from '../types';

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

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const useCheckout = () => {
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

  useEffect(() => {
    if (user) {
      addressesService.getAll(user.id).then(addresses => {
        setSavedAddresses(addresses);
        // Auto-select default address if available
        const defaultAddr = addresses.find(a => a.isDefault);
        if (defaultAddr) {
          handleSelectAddress(defaultAddr);
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
    setValue('address', '');
    setValue('city', '');
    setValue('state', '');
    setValue('pincode', '');
  };

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

      const handleSuccess = async (orderId: string) => {
        setPlacedOrderId(orderId);
        setIsOrderPlaced(true);
        showToast('Order placed successfully!', 'success');
        await clearCart();
      };

      if (data.paymentMethod === 'COD') {
        // COD: Create Order directly via RPC
        const newOrder = await ordersService.create({
            user_id: user.id,
            items: orderItems,
            shipping_address: data.address,
            shipping_city: data.city,
            shipping_state: data.state,
            shipping_pincode: data.pincode,
            payment_method: 'COD'
        });
        await handleSuccess(newOrder.id);
      } else {
        // Online Payment (UPI/CARD): Call Edge Function
        if (!isRazorpayLoaded) {
          showToast('Razorpay SDK not loaded. Please check your internet connection.', 'error');
          setLoading(false);
          return;
        }

        // Call Edge Function to create Order (DB + Razorpay)
        const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
          body: { 
            items: orderItems, 
            shipping_address: data.address,
            shipping_city: data.city,
            shipping_state: data.state,
            shipping_pincode: data.pincode
          }
        });

        if (orderError) {
          console.error('Error creating Razorpay order:', orderError);
          showToast('Failed to initiate payment. Please try again.', 'error');
          setLoading(false);
          return;
        }

        const options = {
          key: orderData.key_id, // Use key from backend
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Pure Elements",
          description: "Order Payment",
          image: "https://via.placeholder.com/150",
          order_id: orderData.razorpay_order_id, // Razorpay Order ID
          handler: async function (response: any) {
            // Payment Success
            // Webhook handles status update.
            await handleSuccess(orderData.order_id);
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

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    loading,
    isOrderPlaced,
    placedOrderId,
    savedAddresses,
    selectedAddressId,
    showAddressForm,
    handleSelectAddress,
    handleAddNewAddress,
    cart,
    cartCount,
    subtotal,
    total
  };
};
