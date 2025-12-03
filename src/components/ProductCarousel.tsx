
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductCarouselProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  variant?: 'default' | 'offer';
  itemsPerViewDesktop?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products, 
  onProductClick, 
  variant = 'default',
  itemsPerViewDesktop = 4 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // We duplicate the items to create a seamless loop effect
  // [Original] + [Original] allows us to slide to the end and reset instantly
  const extendedProducts = [...products, ...products];
  const totalItems = products.length;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Handle seamless loop reset
  useEffect(() => {
    if (currentIndex === totalItems) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(0);
      }, 500); // Matches transition duration
      return () => clearTimeout(timer);
    }
    
    if (currentIndex === -1) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems - 1);
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, totalItems]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getTranslateX = () => {
    // Mobile: 2 items (50% each)
    // Tablet: 3 items (33.33% each) - Optional, we stick to mobile/desktop switch for simplicity
    // Desktop: 4 items (25% each) or custom (e.g. 33.33% for bestsellers sidebar)
    
    // We rely on CSS classes for width, but here we need percentage for translate.
    // However, translating by 100% moves the whole view. 
    // We want to move by 1 item width.
    // 1 item width = 100 / itemsPerView %
    
    // Since we can't easily read current itemsPerView from JS without listeners,
    // we assume desktop view for logic or check window width.
    // A safer way is to translate by percentage of the ITEM.
    
    // Let's use simple logic: current index * (100 / itemsPerView) %
    // BUT itemsPerView changes.
    // Standard solution: Use CSS variable or style prop updated by a hook.
    // Simplified: Just use classes and translate-x based on `currentIndex`.
    // If we move by `currentIndex`, we shift `currentIndex` items.
    
    // We will use flex basis for items.
    return 0; // Handled in render via style
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={carouselRef}>
        <div 
          className={`flex transition-transform duration-500 ease-in-out ${!isAnimating ? '' : ''}`}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 1024 ? itemsPerViewDesktop : 2))}%)`,
            // Note: The inline window check is not reactive to resize, but sufficient for initial render. 
            // Better to use a hook for window size or just CSS-only if possible.
            // Actually, best way is to set --slide-count and use calc.
          }}
        >
          {extendedProducts.map((product, idx) => {
            // Calculate width based on viewport
            // Tailwind: w-1/2 (50%) for mobile, w-1/3 or w-1/4 for desktop
            let widthClass = "w-1/2 flex-shrink-0 px-2";
            if (itemsPerViewDesktop === 3) widthClass += " lg:w-1/3";
            else widthClass += " lg:w-1/4";

            return (
              <div 
                key={`${product.id}-${idx}`} 
                className={widthClass}
                // We need to override the translate style above with a more robust responsive one
                // Actually, doing the transform on the parent container is standard.
                // We need a hook to force re-render on resize to update the transform calc.
              >
                <ProductCard 
                  product={product} 
                  variant={variant}
                  onClick={onProductClick ? () => onProductClick(product) : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 z-10 hover:bg-[#8B7E66] hover:text-white hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 z-10 hover:bg-[#8B7E66] hover:text-white hidden md:block"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

// Hook to handle resize re-renders with debounce
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight]);
      }, 200);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeoutId);
    };
  }, []);
  return size;
}

// Wrapper to inject the hook logic
const ProductCarouselWrapper: React.FC<ProductCarouselProps> = (props) => {
  useWindowSize(); // Force re-render on resize
  return <ProductCarousel {...props} />;
}

export default ProductCarouselWrapper;
