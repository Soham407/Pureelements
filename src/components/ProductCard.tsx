import React from 'react';
import { Product } from '../types';
import { Star, Eye, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import ImageWithFallback from './ImageWithFallback';

interface Props {
  product: Product;
  featured?: boolean;
  variant?: 'default' | 'offer';
  animationDelay?: number;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, featured = false, variant = 'default', animationDelay = 0, onClick }) => {
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const isOffer = variant === 'offer';
  const isWishlisted = isInWishlist(product.id);
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    openCart(); // Immediately open cart for "Buy Now" flow
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
        showToast('Added to wishlist', 'info');
    } else {
        showToast('Removed from wishlist', 'info');
    }
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
            className={`${star <= rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">({rating})</span>
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
        <div className="absolute top-2 right-2 bg-green-600 text-white text-[11px] px-2 py-1 uppercase font-bold z-10 shadow-sm tracking-wider">
          Top Trending
        </div>
      )}
      {product.isSoldOut && (
        <div className="absolute top-0 left-0 bg-brand-secondary text-white text-[11px] px-3 py-1 uppercase font-bold z-10 shadow-sm tracking-wider">
          Sold Out
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <ImageWithFallback 
          src={product.image} 
          alt={product.name} 
          fallbackText={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          width={400}
        />
        
        {/* Quick View Icon Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 backdrop-blur-sm p-3 rounded-full pointer-events-none hidden md:block">
            <Eye className="text-white drop-shadow-md" size={24} />
        </div>

        {/* Quick Action Overlay (Only for default variant) */}
        {!isOffer && (
          <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 justify-end pb-4 md:pb-6 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
            {product.isSoldOut ? (
              <button disabled className="w-full bg-gray-400 text-white px-4 py-2 text-xs uppercase font-medium cursor-not-allowed tracking-wider">
                Sold Out
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-1 md:gap-2 w-full">
                <button 
                  onClick={handleAddToCart}
                  className="flex-[2] bg-brand-primary text-white py-2 text-xs uppercase font-medium hover:bg-brand-dark transition-colors shadow-md tracking-wider whitespace-nowrap"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-[2] bg-brand-dark text-white py-2 text-xs uppercase font-medium hover:bg-black transition-colors shadow-md tracking-wider whitespace-nowrap"
                  aria-label={`Buy ${product.name} now`}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`flex-1 flex items-center justify-center bg-white border py-2 hover:bg-gray-50 transition-colors shadow-md ${
                    isWishlisted ? 'border-red-500 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500'
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`p-3 md:p-4 text-center flex-grow flex flex-col justify-between ${isOffer ? 'pt-4 md:pt-6' : ''}`}>
        <div>
          <h3 className="text-sm font-serif font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] leading-relaxed group-hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-2 mb-2 h-4 md:h-5 overflow-hidden text-ellipsis whitespace-nowrap">{product.category}</p>
          
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
                    : 'bg-brand-primary text-white hover:bg-brand-secondary'
                }`}
                onClick={!product.isSoldOut ? handleAddToCart : undefined}
                aria-label={product.isSoldOut ? "Sold Out" : `Add ${product.name} to cart`}
              >
                {product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
              {!product.isSoldOut && (
                <div className="flex gap-2">
                  <button 
                    className="flex-[4] py-2 text-xs uppercase font-bold tracking-widest transition-colors border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    onClick={handleBuyNow}
                    aria-label={`Buy ${product.name} now`}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleWishlistClick}
                    className={`flex-1 flex items-center justify-center border py-2 transition-colors ${
                      isWishlisted ? 'border-red-500 text-red-500' : 'border-brand-primary text-brand-primary hover:bg-gray-50 hover:text-red-500'
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;