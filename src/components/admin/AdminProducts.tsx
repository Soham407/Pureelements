
import React, { useState, useMemo } from 'react';
import { Product, NavItem } from '../../types';
import { Edit, Search, X, Save, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  products: Product[];
  navItems: NavItem[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
}

const AdminProducts: React.FC<Props> = ({ products, navItems, onUpdateProduct, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 10;
  const { showToast } = useToast();

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, sortConfig]);

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleAddNew = () => {
    setEditingProduct({
        id: 0, // 0 indicates new
        name: '',
        mainCategory: 'SKIN CARE', // Required for filtering
        price: 0,
        image: 'https://picsum.photos/400/500', 
        description: '',
        isSoldOut: false,
        isBestSeller: false
    } as Product);
  };

  const handleSave = async () => {
    if (editingProduct) {
      if (!editingProduct.mainCategory) {
        showToast('Main Category is required', 'error');
        return;
      }
      if (editingProduct.price < 0) {
        showToast('Price cannot be negative', 'error');
        return;
      }
      if (editingProduct.originalPrice && editingProduct.originalPrice < 0) {
        showToast('Original price cannot be negative', 'error');
        return;
      }

      try {
        if (editingProduct.id === 0) {
          // Create new
          await onAddProduct(editingProduct);
          showToast('Product added successfully!', 'success');
        } else {
          // Update existing
          await onUpdateProduct(editingProduct);
          showToast('Product updated successfully!', 'success');
        }
        setEditingProduct(null);
      } catch (error: any) {
        console.error('Error saving product:', error);
        const errorMessage = error?.message || 'Failed to save product. Please try again.';
        showToast(errorMessage, 'error');
      }
    }
  };

  // Get available subcategories based on selected main category
  const availableSubCategories = useMemo(() => {
    if (!editingProduct?.mainCategory) return [];
    const navItem = navItems.find(item => item.name === editingProduct.mainCategory);
    return navItem?.subItems || [];
  }, [editingProduct?.mainCategory, navItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    
    setEditingProduct(prev => {
        if (!prev) return null;
        
        // If main category changes, clear subcategory if it's not valid for the new category
        if (name === 'mainCategory') {
          const navItem = navItems.find(item => item.name === value);
          const validSubCategories = navItem?.subItems || [];
          const currentSubCategory = prev.subCategory;
          
          return {
            ...prev,
            mainCategory: value,
            // Clear subcategory if it's not in the new category's subcategories
            subCategory: currentSubCategory && validSubCategories.includes(currentSubCategory) 
              ? currentSubCategory 
              : undefined
          };
        }
        
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-[#8B7E66] bg-white"
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
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                
                <th 
                  className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Product
                    {sortConfig?.key === 'name' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500" />
                    )}
                  </div>
                </th>

                <th 
                  className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortConfig?.key === 'category' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500" />
                    )}
                  </div>
                </th>

                <th 
                  className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortConfig?.key === 'price' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500" />
                    )}
                  </div>
                </th>

                <th 
                  className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('isSoldOut')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortConfig?.key === 'isSoldOut' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500" />
                    )}
                  </div>
                </th>

                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm text-gray-500 font-mono">
                    {startIndex + index + 1}
                  </td>
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-sm shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold">{startIndex + 1}</span> to <span className="font-bold">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold">{filteredProducts.length}</span> products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 border rounded-sm ${currentPage === 1 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show pages around current page
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-bold ${
                    currentPage === pageNum 
                      ? 'bg-[#8B7E66] text-white' 
                      : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-sm ${currentPage === totalPages ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

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
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none bg-white" 
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
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none bg-white" 
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
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none bg-white" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Category *</label>
                          <select 
                             name="mainCategory" 
                             value={editingProduct.mainCategory || ''} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none bg-white" 
                             required
                          >
                             <option value="">Select Main Category</option>
                             {navItems.filter(item => item.name !== 'ABOUT US' && item.name !== 'OFFERS' && item.name !== 'GIFTING' && item.name !== 'REGIMES').map(item => (
                               <option key={item.name} value={item.name}>{item.name}</option>
                             ))}
                          </select>
                          <p className="text-xs text-gray-400 mt-1">Required: This determines where the product appears</p>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Category</label>
                          {editingProduct.mainCategory ? (
                            <select 
                               name="subCategory" 
                               value={editingProduct.subCategory || ''} 
                               onChange={handleChange}
                               className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none bg-white" 
                            >
                               <option value="">Select Sub Category (Optional)</option>
                               {availableSubCategories.map(sub => (
                                 <option key={sub} value={sub}>{sub}</option>
                               ))}
                            </select>
                          ) : (
                            <input 
                               type="text"
                               disabled
                               placeholder="Select Main Category first"
                               className="w-full border border-gray-200 p-2 rounded-sm bg-gray-50 text-gray-400 cursor-not-allowed" 
                            />
                          )}
                          {availableSubCategories.length === 0 && editingProduct.mainCategory && (
                            <p className="text-xs text-gray-400 mt-1">This category has no subcategories</p>
                          )}
                      </div>
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                          <input 
                             name="image" 
                             value={editingProduct.image} 
                             onChange={handleChange}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none text-sm font-mono text-gray-500 bg-white" 
                          />
                      </div>
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                          <textarea 
                             name="description" 
                             value={editingProduct.description || ''} 
                             onChange={handleChange}
                             rows={3}
                             className="w-full border border-gray-200 p-2 rounded-sm focus:border-[#8B7E66] outline-none text-sm bg-white" 
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
