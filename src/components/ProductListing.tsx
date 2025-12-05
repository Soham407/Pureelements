import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './SkeletonLoader';
import ErrorState from './ErrorState';
import { ChevronRight, Filter, X, Search, ChevronDown, ChevronLeft } from 'lucide-react';
import { Product, NavItem } from '../types';
import { productsService } from '../lib/database';

import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface Props {
  // products prop removed as we fetch internally
  navItems: NavItem[];
  initialCategory: string;
  initialSubCategory?: string;
  initialSearchQuery?: string;
  onNavigate: (category: string, subCategory?: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductListing: React.FC<Props> = ({ navItems, initialCategory, initialSubCategory, initialSearchQuery, onNavigate, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string | undefined>(initialSubCategory);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [sortOrder, setSortOrder] = useState<'RECOMMENDED' | 'LOW_HIGH' | 'HIGH_LOW'>('RECOMMENDED');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);
  
  // Data Fetching State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  useOnClickOutside(sortRef, () => setIsSortOpen(false));

  useEffect(() => {
    setActiveCategory(initialCategory);
    setActiveSubCategory(initialSubCategory);
    setSearchQuery(initialSearchQuery || '');
    setPage(1); // Reset page on category change
  }, [initialCategory, initialSubCategory, initialSearchQuery]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts: Product[] = [];
        let fetchedTotal = 0;

        // Map sortOrder to API expected values
        let apiSort = 'newest';
        if (sortOrder === 'LOW_HIGH') apiSort = 'price_asc';
        else if (sortOrder === 'HIGH_LOW') apiSort = 'price_desc';
        else if (sortOrder === 'RECOMMENDED') apiSort = 'newest'; // Default to newest for now

        if (activeCategory === 'SEARCH' && searchQuery.trim()) {
           const result = await productsService.search(searchQuery.trim(), page, LIMIT);
           fetchedProducts = result.products;
           fetchedTotal = result.total;
        } else {
           // Standard Category Fetch (handles OFFERS too now)
           const result = await productsService.getByCategory(activeCategory, activeSubCategory, page, LIMIT, apiSort);
           fetchedProducts = result.products;
           fetchedTotal = result.total;
        }

        setProducts(fetchedProducts);
        setTotal(fetchedTotal);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please check your connection and try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeSubCategory, searchQuery, page, sortOrder]); // Re-fetch on sort change is inefficient if client-side, but if we move to server-side sort it's needed.

  const handleSidebarClick = (categoryName: string, subCategoryName?: string) => {
    setActiveCategory(categoryName);
    setActiveSubCategory(subCategoryName);
    onNavigate(categoryName, subCategoryName);
    setIsMobileFilterOpen(false);
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
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in min-h-screen pb-24">
      {/* Breadcrumb & Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center flex-wrap">
          <span className="cursor-pointer hover:text-brand-primary" onClick={() => onNavigate('HOME')}>Home</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className={`font-bold ${!activeSubCategory ? 'text-brand-primary' : 'text-gray-800'}`}>
            {isSearchMode ? `Search Results` : formatTitle(activeCategory)}
          </span>
          {activeSubCategory && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-brand-primary font-bold">{activeSubCategory}</span>
            </>
          )}
        </div>

        <div className="flex gap-4 self-start md:self-auto">
          {!isSearchMode && (
            <button 
              className="md:hidden flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hover:bg-black transition-colors"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              {isMobileFilterOpen ? <X size={16}/> : <Filter size={16} />}
              {isMobileFilterOpen ? 'Close' : 'Filter'}
            </button>
          )}
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button 
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:border-brand-primary"
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
        {/* Sidebar */}
        {!isSearchMode && (
            <div className={`lg:w-1/4 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-gray-100 p-6 sticky top-24 shadow-sm rounded-sm">
                <h3 className="font-serif text-xl font-bold mb-6 border-b border-gray-200 pb-4 text-brand-dark">
                    {currentNav ? formatTitle(currentNav.name) : formatTitle(activeCategory)}
                </h3>
                
                <ul className="space-y-1">
                    <li>
                        <button 
                            className={`w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-sm flex items-center justify-between group ${
                                !activeSubCategory 
                                ? 'bg-brand-surface text-brand-primary font-bold border-l-2 border-brand-primary' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'
                            }`}
                            onClick={() => handleSidebarClick(activeCategory, undefined)}
                        >
                            <span>All {currentNav ? formatTitle(currentNav.name) : 'Products'}</span>
                            {!activeSubCategory && <ChevronRight size={14} />}
                        </button>
                    </li>

                    {currentNav?.subItems?.map(sub => (
                        <li key={sub}>
                            <button 
                                className={`w-full text-left py-2 px-3 text-sm transition-all duration-200 rounded-sm flex items-center justify-between group ${
                                    activeSubCategory === sub 
                                    ? 'bg-brand-surface text-brand-primary font-bold border-l-2 border-brand-primary' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'
                                }`}
                                onClick={() => handleSidebarClick(activeCategory, sub)}
                            >
                                <span>{sub}</span>
                                {activeSubCategory === sub && <ChevronRight size={14} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        )}

        {/* Product Grid */}
        <div className={`w-full ${!isSearchMode ? 'lg:w-3/4' : ''}`}>
           <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                  <h1 className="font-serif text-2xl md:text-3xl text-gray-800 flex items-center gap-2">
                    {isSearchMode && <Search className="text-brand-primary" />}
                    {isSearchMode 
                        ? `Search: "${searchQuery}"` 
                        : (activeSubCategory || formatTitle(activeCategory))
                    }
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">
                    {loading ? 'Loading...' : `${total} ${total === 1 ? 'Product' : 'Products'} Found`}
                  </p>
              </div>
           </div>
           
           {loading ? (
             <div className={`grid grid-cols-2 ${isSearchMode ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
               {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="h-full">
                   <ProductCardSkeleton />
                 </div>
               ))}
             </div>
           ) : error ? (
             <ErrorState 
                message={error} 
                onRetry={() => {
                   setPage(1);
                   // Trigger re-fetch by toggling a dummy state or just calling the effect dependencies
                   // In this case, we can just reload the page or rely on the user to change filters
                   window.location.reload(); 
                }} 
             />
           ) : products.length > 0 ? (
             <>
                <div className={`grid grid-cols-2 ${isSearchMode ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
                {products.map((product, index) => (
                    <div key={product.id} className="animate-fade-in-up">
                        <ProductCard 
                            product={product} 
                            onClick={() => onProductClick(product)}
                        />
                    </div>
                ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 border border-gray-200 rounded-sm hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 flex items-center justify-center border rounded-sm transition-colors ${
                                    page === p 
                                    ? 'bg-brand-primary text-white border-brand-primary' 
                                    : 'border-gray-200 hover:border-brand-primary text-gray-600'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 border border-gray-200 rounded-sm hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
             </>
           ) : (
             <div className="py-24 text-center bg-[#F9F9F9] rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                    {isSearchMode ? "No matches found" : "No products found"}
                </h3>
                <p className="text-gray-500 font-light max-w-md mb-6">
                    {isSearchMode 
                        ? `We couldn't find any products matching "${searchQuery}". Try checking for typos or using different keywords.` 
                        : "We couldn't find any products in this category at the moment."}
                </p>
                {isSearchMode ? (
                    <button 
                    onClick={() => onNavigate('HOME')} 
                    className="bg-brand-primary text-white px-6 py-2 text-xs uppercase font-bold tracking-wider hover:bg-brand-secondary transition-colors"
                    >
                    Browse All Categories
                    </button>
                ) : (
                    <button 
                    onClick={() => handleSidebarClick(activeCategory, undefined)} 
                    className="bg-brand-primary text-white px-6 py-2 text-xs uppercase font-bold tracking-wider hover:bg-brand-secondary transition-colors"
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
