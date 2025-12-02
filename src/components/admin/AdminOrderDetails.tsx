import React from 'react';
import { X, MapPin, Phone, Mail, Package, CreditCard, Calendar } from 'lucide-react';
import { Order } from '../../types';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminOrderDetails: React.FC<Props> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-3xl relative z-10 rounded-sm shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="font-serif text-xl text-gray-800 flex items-center gap-3">
              Order #{order.id}
              <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.status}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <Calendar size={12} />
              Placed on {order.date}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                <MapPin size={14} /> Shipping Address
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-sm">
                {/* Note: Order type in frontend might need to be updated if we want full address details here. 
                    Currently Order type has shipping_address as string or structured? 
                    Let's check the type definition. It seems Order interface in types/index.ts has limited fields.
                    We might need to fetch full details or rely on what's available.
                    For now, assuming we might have added these fields or will display what's available.
                */}
                <p className="font-bold text-gray-800 mb-1">Customer Name (Need to fetch)</p>
                <p>Shipping Address (Need to fetch)</p>
                <p>City, State - Pincode</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                <CreditCard size={14} /> Payment Info
              </h3>
              <div className="text-sm text-gray-600 space-y-3 bg-gray-50 p-4 rounded-sm">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-gray-800">UPI / COD (Fetch)</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-bold text-gray-800">Total Amount:</span>
                  <span className="font-bold text-gray-800 text-lg">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <Package size={14} /> Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-sm hover:border-gray-300 transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">{item.productName}</h4>
                    <p className="text-xs text-gray-500">Product ID: {item.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">₹{item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold uppercase text-xs tracking-wider hover:bg-gray-50 transition-colors rounded-sm">
            Close
          </button>
          <button className="px-6 py-2 bg-[#2C2C2C] text-white font-bold uppercase text-xs tracking-wider hover:bg-black transition-colors rounded-sm flex items-center gap-2">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
