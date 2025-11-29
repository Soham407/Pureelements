
import React from 'react';
import { Product, Order } from '../../types';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

interface Props {
  products: Product[];
  orders: Order[];
}

const AdminDashboard: React.FC<Props> = ({ products, orders }) => {
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockProducts = products.filter(p => p.isSoldOut).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="text-green-600" size={24} />,
      bg: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingBag className="text-blue-600" size={24} />,
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      icon: <TrendingUp className="text-purple-600" size={24} />,
      bg: 'bg-purple-50'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package className="text-[#8B7E66]" size={24} />,
      bg: 'bg-[#FFFBF2]'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map(order => (
             <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-4">
                   <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                   <div>
                      <p className="font-bold text-sm text-gray-800">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items • ₹{order.total}</p>
                   </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">{order.status}</span>
             </div>
          ))}
        </div>
      </div>
      
      {lowStockProducts > 0 && (
         <div className="bg-red-50 border border-red-100 p-4 rounded-sm flex items-start gap-3">
             <Package className="text-red-500 mt-0.5" size={18} />
             <div>
                 <h4 className="font-bold text-red-800 text-sm">Stock Alert</h4>
                 <p className="text-xs text-red-600 mt-1">There are {lowStockProducts} products marked as "Sold Out".</p>
             </div>
         </div>
      )}
    </div>
  );
};

export default AdminDashboard;
