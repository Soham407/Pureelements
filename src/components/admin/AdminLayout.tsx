
import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Settings, Image as ImageIcon } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCategories from './AdminCategories';
import AdminBanners from './AdminBanners';
import { Product, Order, NavItem, Slide } from '../../types';

interface Props {
  products: Product[];
  orders: Order[];
  navItems: NavItem[];
  slides: Slide[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateNav: (items: NavItem[]) => void;
  onUpdateHero: (slides: Slide[]) => void;
  onExitAdmin: () => void;
}

type AdminView = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'CONTENT' | 'SETTINGS';

const AdminLayout: React.FC<Props> = ({ 
  products, 
  orders, 
  navItems,
  slides,
  onUpdateProduct, 
  onAddProduct, 
  onUpdateOrderStatus, 
  onUpdateNav,
  onUpdateHero,
  onExitAdmin 
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('DASHBOARD');

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <AdminDashboard products={products} orders={orders} />;
      case 'PRODUCTS':
        return <AdminProducts products={products} navItems={navItems} onUpdateProduct={onUpdateProduct} onAddProduct={onAddProduct} />;
      case 'ORDERS':
        return <AdminOrders orders={orders} onUpdateStatus={onUpdateOrderStatus} />;
      case 'CONTENT':
        return <AdminBanners slides={slides} onUpdateHero={onUpdateHero} />;
      case 'SETTINGS':
        return <AdminCategories navItems={navItems} onUpdateNav={onUpdateNav} />;
      default:
        return <AdminDashboard products={products} orders={orders} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-brand-dark text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="font-serif text-xl font-bold tracking-wide">ADMIN PANEL</h1>
          <p className="text-xs text-gray-400 mt-1">Pure Elements</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'DASHBOARD' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Dashboard</span>
          </button>
          
          <button
            onClick={() => setCurrentView('PRODUCTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'PRODUCTS' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Package size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Products</span>
          </button>

          <button
            onClick={() => setCurrentView('ORDERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'ORDERS' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <ShoppingCart size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Orders</span>
          </button>

          <button
            onClick={() => setCurrentView('CONTENT')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'CONTENT' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <ImageIcon size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Content</span>
          </button>

          <button
            onClick={() => setCurrentView('SETTINGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentView === 'SETTINGS' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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