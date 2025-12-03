
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './SkeletonLoader';
import { ChevronRight, Filter, X, Search, ChevronDown } from 'lucide-react';
import { Product, NavItem } from '../types';
import { productsService } from '../lib/database';

import { useOnClickOutside } from '../hooks/useOnClickOutside';

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
  const [sortOrder, setSortOrder] = useState<'RECOMMENDED' | 'LOW_HIGH' | 'HIGH_LOW'>('RECOMMENDED');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useOnClickOutside(sortRef, () => setIsSortOpen(false));

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveSubCategory(initialSubCategory);
    setSearchQuery(initialSearchQuery || '');
  }, [initialCategory, initialSubCategory, initialSearchQuery]);

  // Backend search when in search mode
  useEffect(() => {
    const performSearch = async () => {
      if (activeCategory === 'SEARCH' && searchQuery.trim()) {
        setIsSearching(true);
        try {
          const { products: results } = await productsService.search(searchQuery.trim(), 1, 100);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [activeCategory, searchQuery]);

  const filteredProducts = (() => {
    // 1. Search Logic - Use backend search results
    if (activeCategory === 'SEARCH') {
      return searchResults;
    }

    // 2. Offer Logic
    if (activeCategory === 'OFFERS') {
      return products.filter(product => product.originalPrice && product.originalPrice > product.price);
    }

    // 3. Category Logic
    let filtered = products.filter(product => {
      const productMain = product.mainCategory?.trim().toUpperCase();
      const currentMain = activeCategory.trim().toUpperCase();
      return productMain === currentMain;
    });

    // 4. SubCategory Logic
    if (activeSubCategory) {
      filtered = filtered.filter(product => 
        product.subCategory?.trim().toUpperCase() === activeSubCategory.trim().toUpperCase()
      );
    }
    
    return filtered;
  })();

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'LOW_HIGH') {
      return a.price - b.price;
    }
    if (sortOrder === 'HIGH_LOW') {
      return b.price - a.price;
    }
    return 0; // Recommended (Default order)
  });

  const handleSidebarClick = (categoryName: string, subCategoryName?: string) => {
    setActiveCategory(categoryName);
    setActiveSubCategory(subCategoryName);
    onNavigate(categoryName, subCategoryName);
    setIsMobileFilterOpen(false); // Close mobile menu after selection
  };

  const handleSortChange = (order: 'RECOMMENDED' | 'LOW_HIGH' | 'HIGH_LOW') => {
    setSortOrder(order);
    setIsSortOpen(false);
  };

  const formatTitle = (str: string) => {
    return str.split(/[- ]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const currentNav = navItems.find(item => item.name === activeCategory);
  const isSearchMode = activeCategory === 'SEARCH';

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in min-h-screen pb-24">
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

        <div className="flex gap-4 self-start md:self-auto">
          {!isSearchMode && (
            <button 
              className="md:hidden flex items-center gap-2 bg-[#2C2C2C] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hover:bg-black transition-colors"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              {isMobileFilterOpen ? <X size={16}/> : <Filter size={16} />}
              {isMobileFilterOpen ? 'Close' : 'Filter'}
            </button>
          )}
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button 
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:border-[#8B7E66]"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              Sort by: {sortOrder === 'RECOMMENDED' ? 'Recommended' : sortOrder === 'LOW_HIGH' ? 'Price: Low to High' : 'Price: High to Low'}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-lg rounded-sm overflow-hidden z-20 animate-fade-in">
                <button onClick={() => handleSortChange('RECOMMENDED')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Recommended</button>
                <button onClick={() => handleSortChange('LOW_HIGH')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: Low to High</button>
                <button onClick={() => handleSortChange('HIGH_LOW')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: High to Low</button>
              </div>
            )}
          </div>
        </div>
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
                    {isSearching ? 'Searching...' : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'Product' : 'Products'} Found`}
                  </p>
              </div>
           </div>
           
           {sortedProducts.length > 0 ? (
             <div className={`grid grid-cols-2 ${isSearchMode ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
               {sortedProducts.map((product, index) => (
                 <div key={product.id} className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${index * 50}ms` }}>
                    <ProductCard 
                        product={product} 
                        onClick={() => onProductClick(product)}
                    />
                 </div>
               ))}
             </div>
           ) : isSearching ? (
             <div className={`grid grid-cols-2 ${isSearchMode ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                 <div key={i} className="h-full">
                   <ProductCardSkeleton />
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-24 text-center bg-[#F9F9F9] rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 font-serif text-lg mb-2">
                    {isSearchMode ? `No products matching "${searchQuery}"` : "No products found in this category."}
                </p>
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
