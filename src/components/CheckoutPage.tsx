import React from 'react';
import { useCheckout } from '../hooks/useCheckout';
import AddressSection from './checkout/AddressSection';
import PaymentSection from './checkout/PaymentSection';
import OrderSummary from './checkout/OrderSummary';
import { CheckCircle } from 'lucide-react';

interface Props {
  onNavigateHome: () => void;
}

const CheckoutPage: React.FC<Props> = ({ onNavigateHome }) => {
  const {
    register,
    handleSubmit,
    errors,
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
  } = useCheckout();

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
              <AddressSection 
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onAddNewAddress={handleAddNewAddress}
                showAddressForm={showAddressForm}
                register={register}
                errors={errors}
              />
              <PaymentSection 
                register={register}
                errors={errors}
              />
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
             <OrderSummary 
                cart={cart}
                subtotal={subtotal}
                total={total}
                loading={loading}
                formId="checkout-form"
             />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
