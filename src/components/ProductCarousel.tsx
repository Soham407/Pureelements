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
      }, 500);
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

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={carouselRef}>
        <div 
          className={`flex transition-transform duration-500 ease-in-out [--items-visible:2] lg:[--items-visible:4]`}
          style={{ 
            transform: `translateX(calc(-100% / var(--items-visible) * ${currentIndex}))`,
          }}
        >
          {extendedProducts.map((product, idx) => {
            return (
              <div 
                key={`${product.id}-${idx}`} 
                className="w-[calc(100%/2)] lg:w-[calc(100%/4)] flex-shrink-0 px-2"
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
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 z-10 hover:bg-[#8B7E66] hover:text-white hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ProductCarousel;
