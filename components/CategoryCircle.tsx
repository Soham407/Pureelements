import React from 'react';
import { Category } from '../types';

const CategoryCircle: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer p-4">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brand-primary transition-all duration-300 shadow-md">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <span className="mt-4 text-sm md:text-base font-medium text-gray-700 group-hover:text-brand-primary transition-colors text-center">
        {category.name}
      </span>
    </div>
  );
};

export default CategoryCircle;