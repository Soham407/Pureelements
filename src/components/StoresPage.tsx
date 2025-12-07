import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { storesData, Store } from '../data/stores';

const StoresPage: React.FC = () => {
  const stores = storesData;

  const getDirectionsUrl = (store: Store) => {
    const query = encodeURIComponent(`${store.name} ${store.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Page Header */}
      <div className="pt-16 pb-12 text-center bg-[#FFFBF2] mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-[#3A5A40]">Pure Elements Flagship Stores</h1>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {stores.map((store, index) => (
          <StoreItem 
            key={store.id} 
            store={store} 
            isLast={index === stores.length - 1}
            getDirectionsUrl={getDirectionsUrl}
          />
        ))}
      </div>
      
      {/* Decorative End */}
      <div className="flex justify-center mt-20 opacity-30">
        <img 
          src="/images/Stores/leaves.svg" 
          alt="Decorative leaves" 
          className="h-5 w-auto"
        />
      </div>
    </div>
  );
};

interface StoreItemProps {
  store: Store;
  isLast: boolean;
  getDirectionsUrl: (store: Store) => string;
}

const StoreItem: React.FC<StoreItemProps> = ({ store, isLast, getDirectionsUrl }) => {
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const imagesPerSet = 3;
  const totalSets = Math.ceil(store.images.length / imagesPerSet);
  
  // Create infinite loop by duplicating images array
  const extendedImages = [...store.images, ...store.images, ...store.images];
  const startIndex = store.images.length + (currentImageSet * imagesPerSet);
  const currentImages = extendedImages.slice(startIndex, startIndex + imagesPerSet);

  const nextSet = () => {
    setCurrentImageSet((prev) => {
      const next = prev + 1;
      // Reset to 0 when reaching the end for seamless loop
      return next >= totalSets ? 0 : next;
    });
  };

  const prevSet = () => {
    setCurrentImageSet((prev) => {
      const prevIndex = prev - 1;
      // Loop to last set when going before 0
      return prevIndex < 0 ? totalSets - 1 : prevIndex;
    });
  };

  // Auto-play infinite loop
  useEffect(() => {
    if (totalSets <= 1) return; // No need to auto-play if only one set
    
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => {
        const next = prev + 1;
        return next >= totalSets ? 0 : next;
      });
    }, 4000); // Change set every 4 seconds

    return () => clearInterval(interval);
  }, [totalSets]);

  return (
    <div className="flex flex-col items-center animate-fade-in mb-12">
      {/* Header Info */}
      <div className="text-center mb-6">
        <h3 className="font-sans text-xl md:text-2xl text-[#3A5A40] mb-2 font-medium">
          {store.name}
        </h3>
        <div className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
          <p>{store.address}</p>
          <p className="mt-1">{store.phone}</p>
        </div>
      </div>

      {/* Image Grid - 3 images side by side */}
      <div className="w-full max-w-5xl relative group mb-8">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm shadow-md">
              <img 
                src={img} 
                alt={`${store.name} - View ${currentImageSet * imagesPerSet + idx + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
          {/* Fill empty slots if less than 3 images */}
          {currentImages.length < imagesPerSet && 
            Array.from({ length: imagesPerSet - currentImages.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-[4/3] bg-gray-100 rounded-sm"></div>
            ))
          }
        </div>

        {/* Navigation Arrows - only show if more than 3 images */}
        {store.images.length > imagesPerSet && (
          <>
            <button 
              onClick={prevSet}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSet}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {Array.from({ length: totalSets }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageSet(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageSet ? 'bg-white w-4' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Google Map Button */}
      <a 
        href={getDirectionsUrl(store)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-6 py-2.5 bg-white border border-[#5D6D55] rounded-sm hover:shadow-lg transition-all group mb-12"
      >
        {/* Google Maps Icon */}
        <div className="w-6 h-6">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
        </div>
        <span className="text-[#5D6D55] text-xs font-bold uppercase tracking-widest group-hover:text-[#3A5A40]">
          Get Store Location
        </span>
      </a>

      {/* Divider */}
      {!isLast && (
        <div className="flex justify-center items-center my-8 opacity-40">
          <img 
            src="/images/Stores/leaves.svg" 
            alt="Decorative leaves" 
            className="h-5 w-auto"
          />
        </div>
      )}
    </div>
  );
};

export default StoresPage;
