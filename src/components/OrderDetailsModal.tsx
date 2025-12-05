
import React from 'react';
import { Order } from '../types';
import { X, Package, MapPin, Calendar, CreditCard } from 'lucide-react';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white w-full max-w-2xl relative z-10 rounded-sm shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-brand-surface">
           <div>
              <h3 className="font-serif text-xl font-bold text-gray-800">Order Details</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">#{order.id}</p>
           </div>
           <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-600" />
           </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
           
           {/* Status Bar */}
           <div className="flex items-center justify-between bg-gray-50 p-4 rounded-sm border border-gray-100">
               <div className="flex items-center gap-3">
                   <Calendar size={18} className="text-gray-400" />
                   <div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Order Date</p>
                       <p className="text-sm font-medium text-gray-800">{order.date}</p>
                   </div>
               </div>
               <div className="text-right">
                   <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status</p>
                   <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                   }`}>
                        {order.status}
                   </span>
               </div>
           </div>

           {/* Items List */}
           <div>
               <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Package size={18} className="text-brand-primary" /> Items Ordered
               </h4>
               <div className="space-y-4">
                   {order.items.map((item, idx) => (
                       <div key={idx} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                           <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                               <img src={item.image} className="w-full h-full object-cover" alt={item.productName} />
                           </div>
                           <div className="flex-1">
                               <p className="font-serif font-medium text-gray-800">{item.productName}</p>
                               <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
               {/* Address (Mocked for prototype as Order type implies simplified structure) */}
               <div>
                   <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <MapPin size={18} className="text-brand-primary" /> Shipping Address
                   </h4>
                   <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-sm">
                       <p className="font-bold text-gray-800 mb-1">Ananya Sharma</p>
                       <p>402, Green Valley Apartments,</p>
                       <p>Baner Road, Near High Street,</p>
                       <p>Pune - 411045, Maharashtra.</p>
                       <p className="mt-2 text-xs font-bold text-gray-500">Phone: +91 98765 43210</p>
                   </div>
               </div>

               {/* Payment Summary */}
               <div>
                   <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <CreditCard size={18} className="text-brand-primary" /> Payment Summary
                   </h4>
                   <div className="bg-gray-50 p-4 rounded-sm space-y-2">
                       <div className="flex justify-between text-sm text-gray-600">
                           <span>Subtotal</span>
                           <span>₹{order.total.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-sm text-gray-600">
                           <span>Shipping</span>
                           <span className="text-green-600 font-medium">Free</span>
                       </div>
                       <div className="flex justify-between text-sm text-gray-600">
                           <span>Taxes (Included)</span>
                           <span>₹{(order.total * 0.18).toFixed(0)}</span>
                       </div>
                       <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                           <span>Total Paid</span>
                           <span>₹{order.total.toLocaleString()}</span>
                       </div>
                       <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-200">
                           Paid via UPI (Google Pay)
                       </div>
                   </div>
               </div>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-brand-dark text-white px-6 py-3 uppercase font-bold tracking-widest text-xs hover:bg-black transition-colors rounded-sm"
            >
                Close Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
