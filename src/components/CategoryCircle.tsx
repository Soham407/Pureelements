import React from 'react';
import { Category } from '../types';

const CategoryCircle: React.FC<{ category: Category }> = ({ category }) => {
  return (
     <div className="flex flex-col items-center group cursor-pointer p-6 md:p-8 lg:p-10">
       <div
         className="w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64
                    rounded-full overflow-hidden border-2 border-transparent
                    group-hover:border-brand-primary transition-all duration-300 shadow-md"
       >
         <img 
           src={category.image} 
           alt={category.name} 
           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
         />
       </div>
       <span className="mt-4 md:mt-6 lg:mt-8 text-sm md:text-base lg:text-lg font-medium text-gray-700 group-hover:text-brand-primary transition-colors text-center">
         {category.name}
       </span>
     </div>
  );
};

export default CategoryCircle;