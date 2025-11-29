
import React from 'react';
import { Order } from '../../types';
import { ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const AdminOrders: React.FC<Props> = ({ orders, onUpdateStatus }) => {
  const { showToast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    onUpdateStatus(orderId, newStatus as Order['status']);
    showToast(`Order ${orderId} updated to ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Table */}
       <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-bold text-gray-800">{order.id}</td>
                  <td className="p-4 text-sm text-gray-600">{order.date}</td>
                  <td className="p-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                          {order.items.map((item, idx) => (
                              <span key={idx}>{item.quantity}x {item.productName}</span>
                          ))}
                      </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-800">₹{order.total.toLocaleString()}</td>
                  <td className="p-4">
                      <div className="relative inline-block">
                          <select 
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-1.5 rounded text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer border bg-white ${
                                  order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                  order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                              }`}
                          >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
