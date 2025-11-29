import React, { useState } from 'react';
import { Product } from '../../types';
import { Edit, Search, X, Save } from 'lucide-react';
import { useToast } from '../../ToastContext';

interface Props {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
}

const AdminProducts: React.FC<Props> = ({ products, onUpdateProduct, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleAddNew = () => {
    setEditingProduct({
        id: 0, // 0 indicates new
        name: '',
        category: 'Skin Care',
        price: 0,
        image: 'https://picsum.photos/400/500', 
        description: '',
        isSoldOut: false,
        isBestSeller: false
    } as Product);
  };

  const handleSave = () => {
    if (editingProduct) {
      if (editingProduct.price < 0) {
        showToast('Price cannot be negative', 'error');
        return;
      }
      if (editingProduct.originalPrice && editingProduct.originalPrice < 0) {
        showToast('Original price cannot be negative', 'error');
        return;
      }

      if (editingProduct.id === 0) {
        // Create new
        const newProduct = { ...editingProduct, id: Date.now() };
        onAddProduct(newProduct);
        showToast('Product added successfully!', 'success');
      } else {
        // Update existing
        onUpdateProduct(editingProduct);
        showToast('Product updated successfully!', 'success');
      }
      setEditingProduct(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    
    setEditingProduct(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editingProduct) return;
      const { name, checked } = e.target;
      setEditingProduct(prev => prev ? ({...prev, [name]: checked}) : null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex justify-between items-center">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-[#8B7E66]"
            />
         </div>
         <button 
            onClick={handleAddNew}
            className="bg-[#8B7E66] text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-[#7A6D55]"
         >
            + Add New
         </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="p-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                   </div>
                   <span className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{product.category}</td>
                <td className="p-4 text-sm font-bold text-gray-800">₹{product.price}</td>
                <td className="p-4">
                    {product.isSoldOut ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Sold Out</span>
                    ) : (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">In Stock</span>
                    )}
                </td>
                <td className="p-4 text-right">
                   <button 
                     onClick={() => handleEditClick(product)}
                     className="text-gray-400 hover:text-[#8B7E66] transition-colors p-1"
                   >
                     <Edit size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
           <div className="bg-white w-full max-w-2xl relative z-10 rounded-sm shadow-xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                 <h3 className="font-serif text-xl font-bold text-gray-800">
                    {editingProduct.id === 0 ? 'Add New Product' : 'Edit Product'}
                 </h3>
                 <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-800">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                          <input 
                             name="name" 
                             value={editingProduct.name} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                          <input 
                             type="number"
                             min="0"
                             name="price" 
                             value={editingProduct.price} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price (₹)</label>
                          <input 
                             type="number"
                             min="0"
                             name="originalPrice" 
                             value={editingProduct.originalPrice || ''} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                          <input 
                             name="category" 
                             value={editingProduct.category} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Category</label>
                          <input 
                             name="subCategory" 
                             value={editingProduct.subCategory || ''} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none" 
                          />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                          <input 
                             name="image" 
                             value={editingProduct.image} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none text-sm font-mono text-gray-500" 
                          />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                          <textarea 
                             name="description" 
                             value={editingProduct.description || ''} 
                             onChange={handleChange}
                             rows={3}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none text-sm" 
                          />
                      </div>
                      <div className="col-span-2 flex gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="isSoldOut" 
                                checked={editingProduct.isSoldOut || false} 
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 accent-[#8B7E66]"
                              />
                              <span className="text-sm font-medium text-gray-700">Mark as Sold Out</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="isBestSeller" 
                                checked={editingProduct.isBestSeller || false} 
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 accent-[#8B7E66]"
                              />
                              <span className="text-sm font-medium text-gray-700">Mark as Best Seller</span>
                          </label>
                      </div>
                  </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-600 font-bold uppercase text-sm rounded-sm hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#8B7E66] text-white font-bold uppercase text-sm rounded-sm hover:bg-[#7A6D55] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} /> Save Changes
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;