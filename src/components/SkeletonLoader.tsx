import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded-sm";
  
  const variantClasses = {
    text: "h-4 w-full rounded",
    rectangular: "h-full w-full",
    circular: "rounded-full"
  };

  const style = {
    width: width,
    height: height
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full border border-gray-100 bg-white">
      {/* Image Placeholder */}
      <div className="aspect-[4/5] w-full bg-gray-100 animate-pulse" />
      
      {/* Content Placeholder */}
      <div className="p-4 flex flex-col gap-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <div className="flex justify-center gap-1 my-1">
           <Skeleton variant="circular" width={12} height={12} />
           <Skeleton variant="circular" width={12} height={12} />
           <Skeleton variant="circular" width={12} height={12} />
           <Skeleton variant="circular" width={12} height={12} />
           <Skeleton variant="circular" width={12} height={12} />
        </div>
        <Skeleton variant="text" className="w-1/3 mx-auto h-5" />
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left: Images */}
        <div className="lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
           <div className="flex md:flex-col gap-4">
              {[1,2,3,4].map(i => (
                 <Skeleton key={i} width={80} height={100} />
              ))}
           </div>
           <div className="flex-1 aspect-[4/5]">
              <Skeleton className="w-full h-full" />
           </div>
        </div>

        {/* Right: Info */}
        <div className="lg:w-1/2 space-y-6">
           <Skeleton variant="text" className="h-10 w-3/4" />
           <Skeleton variant="text" className="h-4 w-1/4" />
           <Skeleton variant="text" className="h-6 w-1/3" />
           <Skeleton variant="text" className="h-8 w-1/4" />
           <div className="space-y-2 py-8 border-y border-gray-100">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-2/3" />
           </div>
           <div className="flex gap-4">
              <Skeleton height={50} width={120} />
              <Skeleton height={50} className="flex-1" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
