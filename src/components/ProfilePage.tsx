
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { User, Package, MapPin, LogOut, ChevronRight, Edit2, Heart, ShoppingBag } from 'lucide-react';
import { Order, Product, Address } from '../types';
import ProductCard from './ProductCard';
import OrderDetailsModal from './OrderDetailsModal';
import AddressForm from './AddressForm';
import { ordersService, addressesService } from '../lib/database';

interface Props {
  onProductClick?: (product: Product) => void;
}

const ProfilePage: React.FC<Props> = ({ onProductClick }) => {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ORDERS' | 'ADDRESS' | 'WISHLIST'>('DETAILS');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      // Load Orders
      setIsLoadingOrders(true);
      try {
        const { orders: userOrders } = await ordersService.getAll(user.id, 1, 50);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }

      // Load Addresses
      loadAddresses();
    };

    loadData();
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    try {
      const userAddresses = await addressesService.getAll(user.id);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressesService.delete(id);
        loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefaultAddress = async (address: Address) => {
    if (address.isDefault) return;
    try {
      await addressesService.update(address.id, { isDefault: true, userId: user!.id });
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 min-h-screen bg-[#FFFBF2]">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
             <div className="bg-white p-6 shadow-sm rounded-sm sticky top-24">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-12 h-12 bg-[#8B7E66] rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 leading-tight">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
                
                <nav className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('DETAILS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm ${
                            activeTab === 'DETAILS' ? 'bg-[#FFFBF2] text-[#8B7E66]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <User size={18} /> My Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('ORDERS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm ${
                            activeTab === 'ORDERS' ? 'bg-[#FFFBF2] text-[#8B7E66]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Package size={18} /> My Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab('WISHLIST')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm ${
                            activeTab === 'WISHLIST' ? 'bg-[#FFFBF2] text-[#8B7E66]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Heart size={18} /> My Wishlist
                    </button>
                    <button 
                        onClick={() => setActiveTab('ADDRESS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm ${
                            activeTab === 'ADDRESS' ? 'bg-[#FFFBF2] text-[#8B7E66]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <MapPin size={18} /> Saved Addresses
                    </button>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors rounded-sm mt-8 border-t border-gray-100"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </nav>
             </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-3/4">
             
             {/* Profile Details Tab */}
             {activeTab === 'DETAILS' && (
                <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif text-2xl text-gray-800">Personal Information</h2>
                        <button className="text-[#8B7E66] text-sm flex items-center gap-1 hover:underline">
                            <Edit2 size={14} /> Edit
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Full Name</label>
                            <p className="text-gray-800 font-medium py-2 border-b border-gray-100">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
                            <p className="text-gray-800 font-medium py-2 border-b border-gray-100">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Phone Number</label>
                            <p className="text-gray-800 font-medium py-2 border-b border-gray-100">{user.phone || '-- Not Added --'}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Member Since</label>
                            <p className="text-gray-800 font-medium py-2 border-b border-gray-100">{user.joinedDate}</p>
                        </div>
                    </div>
                </div>
             )}

             {/* Orders Tab */}
             {activeTab === 'ORDERS' && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="font-serif text-2xl text-gray-800 mb-4">Order History</h2>
                    
                    {orders.length > 0 ? orders.map(order => (
                        <div key={order.id} className="bg-white p-6 shadow-sm rounded-sm border border-gray-100">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-gray-100 pb-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
                                    <p className="font-bold text-gray-800">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                                    <p className="font-medium text-gray-800">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total Amount</p>
                                    <p className="font-bold text-gray-800">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-1 ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
                                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 pt-4 flex justify-end">
                                <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-[#8B7E66] text-sm font-bold uppercase tracking-wide flex items-center gap-1 hover:text-[#5D6D55]"
                                >
                                    View Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white p-12 text-center rounded-sm">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    )}
                </div>
             )}

             {/* Wishlist Tab */}
             {activeTab === 'WISHLIST' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="font-serif text-2xl text-gray-800 mb-4">My Wishlist ({wishlist.length})</h2>
                    
                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {wishlist.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onClick={onProductClick ? () => onProductClick(product) : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center rounded-sm">
                            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Your wishlist is empty.</p>
                            <button className="mt-4 text-[#8B7E66] font-bold underline hover:text-[#5D6D55]">Start Shopping</button>
                        </div>
                    )}
                 </div>
             )}

             {/* Addresses Tab */}
             {activeTab === 'ADDRESS' && (
                 <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif text-2xl text-gray-800">Saved Addresses</h2>
                        <button 
                            onClick={handleAddAddress}
                            className="bg-[#8B7E66] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#5D6D55] transition-colors rounded-sm"
                        >
                             + Add New
                        </button>
                    </div>
                    
                    {isLoadingAddresses ? (
                        <div className="text-center py-8 text-gray-500">Loading addresses...</div>
                    ) : addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map(address => (
                                <div key={address.id} className={`border p-5 rounded-sm relative ${address.isDefault ? 'border-[#8B7E66] bg-[#FFFBF2]' : 'border-gray-200'}`}>
                                    {address.isDefault && (
                                        <div className="absolute top-4 right-4 bg-[#8B7E66] text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-wider">Default</div>
                                    )}
                                    {!address.isDefault && (
                                        <button 
                                            onClick={() => handleSetDefaultAddress(address)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-[#8B7E66] text-[10px] uppercase font-bold tracking-wider"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    
                                    <h4 className="font-bold text-gray-800 mb-2">{address.fullName}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {address.addressLine1},<br/>
                                        {address.addressLine2 && <>{address.addressLine2},<br/></>}
                                        {address.city}, {address.state} - {address.pincode}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium mb-4">Phone: {address.phone}</p>
                                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wide">
                                        <button 
                                            onClick={() => handleEditAddress(address)}
                                            className="text-[#8B7E66] hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                            <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No addresses saved yet.</p>
                        </div>
                    )}
                 </div>
             )}

          </div>
        </div>
      </div>
      
      {/* Order Details Modal */}
      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      {/* Address Form Modal */}
      {isAddressFormOpen && user && (
        <AddressForm 
          userId={user.id}
          address={editingAddress}
          onClose={() => setIsAddressFormOpen(false)}
          onSuccess={loadAddresses}
        />
      )}
    </div>
  );
};

export default ProfilePage;
