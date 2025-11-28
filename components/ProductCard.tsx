import React from 'react';
import { Product } from '../types';
import { Star, Eye } from 'lucide-react';
import { useCart } from '../CartContext';

interface Props {
  product: Product;
  featured?: boolean;
  variant?: 'default' | 'offer';
  animationDelay?: number;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, featured = false, variant = 'default', animationDelay = 0, onClick }) => {
  const { addToCart } = useCart();
  const isOffer = variant === 'offer';
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    // In a real app, you might redirect to checkout immediately
    alert(`Added ${product.name} to cart. Proceeding to checkout...`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  // Helper to render stars
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center justify-center gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={`${star <= rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-[10px] text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-white flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
        featured || isOffer ? 'border border-gray-100' : ''
      } ${product.isSoldOut ? 'opacity-75 grayscale-[0.5] hover:grayscale-0' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Badges */}
      {product.isBestSeller && !product.isSoldOut && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-1 uppercase font-bold z-10 shadow-sm">
          Top Trending
        </div>
      )}
      {product.isSoldOut && (
        <div className="absolute top-0 left-0 bg-[#5D6D55] text-white text-[10px] px-3 py-1 uppercase font-bold z-10 shadow-sm">
          Sold Out
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick View Icon Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 backdrop-blur-sm p-3 rounded-full pointer-events-none">
            <Eye className="text-white drop-shadow-md" size={24} />
        </div>

        {/* Quick Action Overlay (Only for default variant) */}
        {!isOffer && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 justify-end pb-6 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
            {product.isSoldOut ? (
              <button disabled className="w-full bg-gray-400 text-white px-4 py-2 text-xs uppercase font-medium cursor-not-allowed tracking-wider">
                Sold Out
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#8B8B7A] text-white px-2 py-2 text-[10px] md:text-xs uppercase font-medium hover:bg-brand-dark transition-colors shadow-md tracking-wider whitespace-nowrap"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#2C2C2C] text-white px-2 py-2 text-[10px] md:text-xs uppercase font-medium hover:bg-black transition-colors shadow-md tracking-wider whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`p-4 text-center flex-grow flex flex-col justify-between ${isOffer ? 'pt-6' : ''}`}>
        <div>
          <h3 className="text-sm font-serif font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] leading-relaxed group-hover:text-[#8B7E66] transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-2 mb-2 h-5 overflow-hidden text-ellipsis whitespace-nowrap">{product.category}</p>
          
          {/* Star Ratings */}
          {renderStars(product.rating)}
          
          <div className="flex justify-center items-center gap-2 text-sm mb-4">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="font-bold text-gray-800 text-sm">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Static Button for Offer Variant */}
        {isOffer && (
            <div className="flex flex-col gap-2">
              <button 
                disabled={product.isSoldOut}
                className={`w-full py-2 text-xs uppercase font-bold tracking-widest transition-colors ${
                  product.isSoldOut 
                    ? 'bg-gray-300 text-white cursor-not-allowed' 
                    : 'bg-[#8B8B7A] text-white hover:bg-[#5D6D55]'
                }`}
                onClick={!product.isSoldOut ? handleAddToCart : undefined}
              >
                {product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
              {!product.isSoldOut && (
                <button 
                  className="w-full py-2 text-xs uppercase font-bold tracking-widest transition-colors border border-[#8B8B7A] text-[#8B8B7A] hover:bg-[#8B8B7A] hover:text-white"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;