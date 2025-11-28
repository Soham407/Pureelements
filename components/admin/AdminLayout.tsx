
import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Settings } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import { Product, Order } from '../../types';

interface Props {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onExitAdmin: () => void;
}

type AdminView = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS';

const AdminLayout: React.FC<Props> = ({ products, orders, onUpdateProduct, onAddProduct, onUpdateOrderStatus, onExitAdmin }) => {
  const [currentView, setCurrentView] = useState<AdminView>('DASHBOARD');

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <AdminDashboard products={products} orders={orders} />;
      case 'PRODUCTS':
        return <AdminProducts products={products} onUpdateProduct={onUpdateProduct} onAddProduct={onAddProduct} />;
      case 'ORDERS':
        return <AdminOrders orders={orders} onUpdateStatus={onUpdateOrderStatus} />;
      case 'SETTINGS':
        return (
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                <Settings size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">Settings</h3>
                <p className="text-gray-500 mt-2">Global application settings and navbar configuration.</p>
                <button className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-sm font-bold text-sm uppercase cursor-not-allowed">Coming Soon</button>
            </div>
        );
      default:
        return <AdminDashboard products={products} orders={orders} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="font-serif text-xl font-bold tracking-wide">ADMIN PANEL</h1>
          <p className="text-xs text-gray-400 mt-1">Pure Elements</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'DASHBOARD' ? 'bg-[#8B7E66] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Dashboard</span>
          </button>
          
          <button
            onClick={() => setCurrentView('PRODUCTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'PRODUCTS' ? 'bg-[#8B7E66] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Package size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Products</span>
          </button>

          <button
            onClick={() => setCurrentView('ORDERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'ORDERS' ? 'bg-[#8B7E66] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <ShoppingCart size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Orders</span>
          </button>

          <button
            onClick={() => setCurrentView('SETTINGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'SETTINGS' ? 'bg-[#8B7E66] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-serif text-2xl text-gray-800 font-bold">
            {currentView.charAt(0) + currentView.slice(1).toLowerCase()}
          </h2>
          <div className="text-sm text-gray-500">
             Welcome, Admin User
          </div>
        </header>

        <main className="p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
