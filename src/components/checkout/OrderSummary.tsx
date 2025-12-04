import React from 'react';
import { CartItem } from '../../types';
import { ArrowRight } from 'lucide-react';

interface Props {
  cart: CartItem[];
  subtotal: number;
  total: number;
  loading: boolean;
  formId: string;
}

const OrderSummary: React.FC<Props> = ({ cart, subtotal, total, loading, formId }) => {
  return (
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
         form={formId}
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
  );
};

export default OrderSummary;
