
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronRight, Filter, X, Search } from 'lucide-react';
import { Product, NavItem } from '../types';

interface Props {
  products: Product[];
  navItems: NavItem[];
  initialCategory: string;
  initialSubCategory?: string;
  initialSearchQuery?: string;
  onNavigate: (category: string, subCategory?: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductListing: React.FC<Props> = ({ products, navItems, initialCategory, initialSubCategory, initialSearchQuery, onNavigate, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(initialSubCategory);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveSubCategory(initialSubCategory);
    setSearchQuery(initialSearchQuery || '');
  }, [initialCategory, initialSubCategory, initialSearchQuery]);

  const filteredProducts = products.filter(product => {
    // 1. Search Logic
    if (activeCategory === 'SEARCH') {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.mainCategory?.toLowerCase().includes(query)
        );
    }

    // 2. Offer Logic
    if (activeCategory === 'OFFERS') {
       return product.originalPrice && product.originalPrice > product.price;
    }

    // 3. Category Logic
    const productMain = product.mainCategory?.trim().toUpperCase();
    const currentMain = activeCategory.trim().toUpperCase();

    if (productMain !== currentMain) return false;

    // 4. SubCategory Logic
    if (activeSubCategory) {
       return product.subCategory?.trim().toUpperCase() === activeSubCategory.trim().toUpperCase();
    }
    
    return true;
  });

  const handleSidebarClick = (categoryName: string, subCategoryName?: string) => {
    setActiveCategory(categoryName);
    setActiveSubCategory(subCategoryName);
    onNavigate(categoryName, subCategoryName);
    setIsMobileFilterOpen(false); // Close mobile menu after selection
  };

  const formatTitle = (str: string) => {
    return str.split(/[- ]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const currentNav = navItems.find(item => item.name === activeCategory);
  const isSearchMode = activeCategory === 'SEARCH';

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in min-h-screen">
      {/* Breadcrumb & Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center flex-wrap">
          <span className="cursor-pointer hover:text-[#8B7E66]" onClick={() => onNavigate('HOME')}>Home</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className={`font-bold ${!activeSubCategory ? 'text-[#8B7E66]' : 'text-gray-800'}`}>
            {isSearchMode ? `Search Results` : formatTitle(activeCategory)}
          </span>
          {activeSubCategory && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-[#8B7E66] font-bold">{activeSubCategory}</span>
            </>
          )}
        </div>

        {!isSearchMode && (
          <button 
            className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded text-sm font-bold text-gray-700 self-start"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            {isMobileFilterOpen ? <X size={16}/> : <Filter size={16} />}
            {isMobileFilterOpen ? 'Close Filters' : 'Filter Categories'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Context Specific (Hidden in Search Mode) */}
        {!isSearchMode && (
            <div className={`lg:w-1/4 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
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

                {(!currentNav?.subItems || currentNav.subItems.length === 0) && (
                    <div className="mt-4 text-xs text-gray-400 italic px-2">
                        Viewing all items in {formatTitle(activeCategory)}
                    </div>
                )}
            </div>
            </div>
        )}

        {/* Product Grid */}
        <div className={`w-full ${!isSearchMode ? 'lg:w-3/4' : ''}`}>
           <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                  <h1 className="font-serif text-2xl md:text-3xl text-gray-800 flex items-center gap-2">
                    {isSearchMode && <Search className="text-[#8B7E66]" />}
                    {isSearchMode 
                        ? `Search: "${searchQuery}"` 
                        : (activeSubCategory || formatTitle(activeCategory))
                    }
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                  </p>
              </div>
           </div>
           
           {filteredProducts.length > 0 ? (
             <div className={`grid grid-cols-2 ${isSearchMode ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
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
                <p className="text-gray-500 font-serif text-lg mb-2">
                    {isSearchMode ? `No products matching "${searchQuery}"` : "No products found in this category."}
                </p>
                <p className="text-gray-400 text-sm">Try using different keywords or selecting a different category.</p>
                {!isSearchMode && (
                    <button 
                    onClick={() => handleSidebarClick(activeCategory, undefined)} 
                    className="mt-6 bg-[#8B7E66] text-white px-6 py-2 text-xs uppercase font-bold tracking-wider hover:bg-[#5D6D55] transition-colors"
                    >
                    Clear Filters
                    </button>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;