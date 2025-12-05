import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[4/5] bg-gray-100 rounded-sm"></div>
      <div className="h-4 w-3/4 bg-gray-100 rounded-sm"></div>
      <div className="h-4 w-1/2 bg-gray-100 rounded-sm"></div>
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery Skeleton */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="hidden md:flex flex-col gap-4 w-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-24 bg-gray-100 rounded-sm"></div>
            ))}
          </div>
          <div className="flex-1 aspect-[4/5] bg-gray-200 rounded-sm"></div>
        </div>

        {/* Details Skeleton */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-4 w-24 bg-gray-100 rounded-sm"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded-sm"></div>
          <div className="h-6 w-1/4 bg-gray-100 rounded-sm"></div>
          <div className="h-24 w-full bg-gray-50 rounded-sm"></div>
          <div className="h-12 w-full bg-gray-200 rounded-sm"></div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-20 bg-gray-50 rounded-sm"></div>
             <div className="h-20 bg-gray-50 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Navbar Skeleton */}
      <div className="h-20 md:h-24 bg-gray-100 border-b border-gray-200 mb-8"></div>

      {/* Hero Skeleton */}
      <div className="container mx-auto px-4 mb-12">
        <div className="w-full h-[300px] md:h-[500px] bg-gray-200 rounded-sm"></div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="h-8 w-48 bg-gray-200 mx-auto mb-10 rounded-sm"></div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/5] bg-gray-100 rounded-sm"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded-sm"></div>
              <div className="h-4 w-1/2 bg-gray-100 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
