import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Store } from '../data/stores';

interface StoreCarouselProps {
  stores: Store[];
  onStoreClick?: () => void;
}

const StoreCarousel: React.FC<StoreCarouselProps> = ({ stores, onStoreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(stores.length); // Start in the middle set
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Create infinite loop by duplicating stores
  const extendedStores = [...stores, ...stores, ...stores];
  const totalStores = stores.length;

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
    if (currentIndex >= totalStores * 2) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalStores);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (currentIndex < totalStores) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalStores * 2 - 1);
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, totalStores]);

  // Auto-play infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(true);
      }
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [isAnimating]);


  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={carouselRef}>
        <div 
          className="flex transition-transform duration-500 ease-in-out [--items-visible:2] lg:[--items-visible:4] items-stretch"
          style={{ 
            transform: `translateX(calc(-100% / var(--items-visible) * ${currentIndex}))`,
          }}
        >
          {extendedStores.map((store, idx) => (
            <div 
              key={`${store.id}-${idx}`} 
              className="w-[calc(100%/2)] lg:w-[calc(100%/4)] flex-shrink-0 px-2 h-full"
            >
              <div 
                className="bg-white shadow-lg group/item cursor-pointer h-full flex flex-col"
                onClick={onStoreClick}
              >
                <div className="h-[180px] md:h-[220px] overflow-hidden relative flex-shrink-0">
                  <img 
                    src={store.images[0]} 
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700" 
                    alt={store.name} 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4 md:p-5 text-center bg-white border-t border-gray-100 flex-1 flex flex-col justify-center min-h-[110px] md:min-h-[120px]">
                  <h4 className="font-serif text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2">{store.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{store.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 z-10 hover:bg-brand-primary hover:text-white hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 z-10 hover:bg-brand-primary hover:text-white hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default StoreCarousel;

