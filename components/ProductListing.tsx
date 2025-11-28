import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS, NAV_ITEMS } from '../constants';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface Props {
  initialCategory: string;
  initialSubCategory?: string;
  onNavigate: (category: string, subCategory?: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductListing: React.FC<Props> = ({ initialCategory, initialSubCategory, onNavigate, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(initialSubCategory);

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveSubCategory(initialSubCategory);
  }, [initialCategory, initialSubCategory]);

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    // Special handling for OFFERS category to show discounted items
    if (activeCategory === 'OFFERS') {
       return product.originalPrice && product.originalPrice > product.price;
    }

    // 1. Check Main Category
    const productMain = product.mainCategory?.trim().toUpperCase();
    const currentMain = activeCategory.trim().toUpperCase();

    if (productMain !== currentMain) return false;

    // 2. Check Sub Category (if selected)
    if (activeSubCategory) {
       return product.subCategory?.trim().toUpperCase() === activeSubCategory.trim().toUpperCase();
    }
    
    return true;
  });

  const handleSidebarClick = (categoryName: string, subCategoryName?: string) => {
    // Update local state and parent state
    setActiveCategory(categoryName);
    setActiveSubCategory(subCategoryName);
    onNavigate(categoryName, subCategoryName);
  };

  const formatTitle = (str: string) => {
    return str.split(/[- ]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Find the configuration for the currently active main category
  const currentNav = NAV_ITEMS.find(item => item.name === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-8 uppercase tracking-widest flex items-center">
        <span className="cursor-pointer hover:text-[#8B7E66]" onClick={() => onNavigate('HOME')}>Home</span>
        <span className="mx-2 text-gray-300">/</span>
        <span className={`font-bold ${!activeSubCategory ? 'text-[#8B7E66]' : 'text-gray-800'}`}>{formatTitle(activeCategory)}</span>
        {activeSubCategory && (
          <>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-[#8B7E66] font-bold">{activeSubCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Context Specific */}
        <div className="lg:w-1/4 flex-shrink-0">
           <div className="bg-white border border-gray-100 p-6 sticky top-24 shadow-sm rounded-sm">
              <h3 className="font-serif text-xl font-bold mb-6 border-b border-gray-200 pb-4 text-[#2C2C2C]">
                {currentNav ? formatTitle(currentNav.name) : formatTitle(activeCategory)}
              </h3>
              
              <ul className="space-y-1">
                 {/* 'All' Option */}
                 <li>
                    <button 
                        className={`w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-sm flex items-center justify-between group ${
                            !activeSubCategory 
                            ? 'bg-[#FFFBF2] text-[#8B7E66] font-bold border-l-2 border-[#8B7E66]' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#8B7E66]'
                        }`}
                        onClick={() => handleSidebarClick(activeCategory, undefined)}
                    >
                        <span>All {currentNav ? formatTitle(currentNav.name) : 'Products'}</span>
                        {!activeSubCategory && <ChevronRight size={14} />}
                    </button>
                 </li>

                 {/* Sub Categories */}
                 {currentNav?.subItems?.map(sub => (
                    <li key={sub}>
                        <button 
                            className={`w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-sm flex items-center justify-between group ${
                                activeSubCategory === sub 
                                ? 'bg-[#FFFBF2] text-[#8B7E66] font-bold border-l-2 border-[#8B7E66]' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-[#8B7E66]'
                            }`}
                            onClick={() => handleSidebarClick(activeCategory, sub)}
                        >
                            <span>{sub}</span>
                            {activeSubCategory === sub && <ChevronRight size={14} />}
                        </button>
                    </li>
                 ))}
              </ul>

              {/* Message if no subcategories exist (e.g. for OFFERS or simple pages) */}
              {(!currentNav?.subItems || currentNav.subItems.length === 0) && (
                 <div className="mt-4 text-xs text-gray-400 italic px-2">
                    Viewing all items in {formatTitle(activeCategory)}
                 </div>
              )}
           </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
           <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                  <h1 className="font-serif text-3xl text-gray-800">
                    {activeSubCategory || formatTitle(activeCategory)}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                  </p>
              </div>
           </div>
           
           {filteredProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               {filteredProducts.map((product, index) => (
                 <div key={product.id} className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${index * 100}ms` }}>
                    <ProductCard 
                        product={product} 
                        onClick={() => onProductClick(product)}
                    />
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-24 text-center bg-[#F9F9F9] rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 font-serif text-lg mb-2">No products found in this category.</p>
                <p className="text-gray-400 text-sm">Try selecting a different category or view all products.</p>
                <button 
                  onClick={() => handleSidebarClick(activeCategory, undefined)} 
                  className="mt-6 bg-[#8B7E66] text-white px-6 py-2 text-xs uppercase font-bold tracking-wider hover:bg-[#5D6D55] transition-colors"
                >
                  Clear Filters
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;