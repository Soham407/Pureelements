import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import AdminOrderDetails from './AdminOrderDetails';
import { ordersService } from '../../lib/database';

const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 20;

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { orders: data, total: count } = await ordersService.getAll(undefined, page, limit);
      setOrders(data);
      setTotal(count);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
        const status = newStatus as Order['status'];
        await ordersService.updateStatus(orderId, status);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        showToast(`Order ${orderId} updated to ${newStatus}`, 'info');
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status', 'error');
    }
  };

  const totalPages = Math.ceil(total / limit);

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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">Loading orders...</td>
                  </tr>
              ) : orders.map(order => (
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
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-[#8B7E66] hover:bg-[#FFFBF2] rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">No orders found.</div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        )}
      </div>

      <AdminOrderDetails 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default AdminOrders;
