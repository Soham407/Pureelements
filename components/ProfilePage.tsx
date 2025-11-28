
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { User, Package, MapPin, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { Order } from '../types';

// Mock Data for orders
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7782-9092',
    date: 'Oct 12, 2023',
    status: 'Delivered',
    total: 2380,
    items: [
        { productName: 'Kumkumadi Saundarya Face Oil', quantity: 2, price: 2380, image: 'https://picsum.photos/id/202/100/100' }
    ]
  },
  {
    id: 'ORD-9921-2210',
    date: 'Sep 28, 2023',
    status: 'Processing',
    total: 1290,
    items: [
        { productName: 'Aalaap Signature Unisex Perfume', quantity: 1, price: 1290, image: 'https://picsum.photos/id/203/100/100' }
    ]
  }
];

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ORDERS' | 'ADDRESS'>('DETAILS');

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 md:py-16 min-h-screen bg-[#FFFBF2]">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
             <div className="bg-white p-6 shadow-sm rounded-sm">
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
                    
                    {MOCK_ORDERS.map(order => (
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
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
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
                                <button className="text-[#8B7E66] text-sm font-bold uppercase tracking-wide flex items-center gap-1 hover:text-[#5D6D55]">
                                    View Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             )}

             {/* Addresses Tab */}
             {activeTab === 'ADDRESS' && (
                 <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif text-2xl text-gray-800">Saved Addresses</h2>
                        <button className="bg-[#8B7E66] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#5D6D55] transition-colors rounded-sm">
                             + Add New
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#8B7E66] bg-[#FFFBF2] p-5 rounded-sm relative">
                            <div className="absolute top-4 right-4 bg-[#8B7E66] text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-wider">Default</div>
                            <h4 className="font-bold text-gray-800 mb-2">{user.name}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                402, Green Valley Apartments,<br/>
                                Baner Road, Near High Street,<br/>
                                Pune - 411045, Maharashtra.
                            </p>
                            <p className="text-sm text-gray-600 font-medium mb-4">Phone: {user.phone}</p>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-wide">
                                <button className="text-[#8B7E66] hover:underline">Edit</button>
                                <button className="text-red-500 hover:underline">Remove</button>
                            </div>
                        </div>
                    </div>
                 </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
