
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Star, Minus, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, Heart, Sparkles, Clock } from 'lucide-react';
import { useCart } from '../CartContext';
import ProductCard from './ProductCard';
import { useToast } from '../ToastContext';
import { useWishlist } from '../WishlistContext';
import ImageWithFallback from './ImageWithFallback';

interface Props {
  product: Product;
  allProducts: Product[];
  onNavigate: (category: string, subCategory?: string) => void;
  onProductClick: (product: Product) => void;
}

// Simple rule engine for cross-sells: Main ID -> Complementary ID
const CROSS_SELL_RULES: Record<number, number> = {
  104: 106, // Face Cleanser -> Face Pack
  105: 309, // Hair Oil -> Shampoo
  309: 308, // Shampoo -> Conditioner
  302: 102, // Night Cream -> Face Oil
  108: 107, // Aloe Gel -> Rose Water
  102: 302, // Face Oil -> Night Cream
};

const ProductDetails: React.FC<Props> = ({ product, allProducts, onNavigate, onProductClick }) => {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('description');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  // Zoom Effect State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });

  const isWishlisted = isInWishlist(product.id);

  // Cross Sell Product Logic
  const complementaryProductId = CROSS_SELL_RULES[product.id];
  const complementaryProduct = complementaryProductId 
    ? allProducts.find(p => p.id === complementaryProductId) 
    : null;

  // Reset state when product changes & Handle History
  useEffect(() => {
    // 1. Reset View State
    setActiveImage(product.image);
    setQuantity(1); // Ensure quantity resets to 1
    setOpenSection('description'); // Reset accordion
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
    
    // 2. Scroll to Top
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    // 3. Update Recently Viewed History
    const storedHistory = localStorage.getItem('pure_elements_viewed');
    let historyIds: number[] = storedHistory ? JSON.parse(storedHistory) : [];

    // Remove current product if exists to move it to top
    historyIds = historyIds.filter(id => id !== product.id);
    
    // Add current to front
    historyIds.unshift(product.id);
    
    // Limit to 5
    if (historyIds.length > 5) historyIds.pop();

    localStorage.setItem('pure_elements_viewed', JSON.stringify(historyIds));

    // Resolve products for UI (excluding current)
    const historyProducts = historyIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined && p.id !== product.id); // Type guard & exclude current
    
    setRecentlyViewed(historyProducts);

  }, [product, allProducts]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
      handleAddToCart();
      openCart();
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Get related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter(p => p.mainCategory === product.mainCategory && p.id !== product.id)
    .slice(0, 4);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-8 flex items-center flex-wrap">
          <span className="cursor-pointer hover:text-[#8B7E66]" onClick={() => onNavigate('HOME')}>Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-[#8B7E66]" onClick={() => onNavigate(product.mainCategory || 'SHOP')}>{product.mainCategory}</span>
          {product.subCategory && (
              <>
                 <span className="mx-2">/</span>
                 <span className="cursor-pointer hover:text-[#8B7E66]" onClick={() => onNavigate(product.mainCategory || 'SHOP', product.subCategory)}>{product.subCategory}</span>
              </>
          )}
          <span className="mx-2">/</span>
          <span className="font-bold text-gray-800">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Images */}
          <div className="lg:w-1/2">
            <div className="flex flex-col-reverse md:flex-row gap-4">
               {/* Thumbnail List */}
               <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                  {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`w-16 h-16 md:w-20 md:h-24 flex-shrink-0 cursor-pointer border-2 transition-all bg-gray-50 ${
                            activeImage === img ? 'border-[#8B7E66]' : 'border-transparent hover:border-gray-200'
                        }`}
                        onClick={() => setActiveImage(img)}
                    >
                        <ImageWithFallback 
                            src={img} 
                            className="w-full h-full object-cover" 
                            alt={`View ${idx}`} 
                        />
                    </div>
                  ))}
               </div>

               {/* Main Image with Zoom */}
               <div 
                  className="flex-1 aspect-[4/5] bg-gray-50 relative overflow-hidden cursor-crosshair group"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
               >
                  <ImageWithFallback 
                      src={activeImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform" 
                      style={zoomStyle}
                  />
                  
                  {product.isSoldOut && (
                    <div className="absolute top-0 left-0 bg-[#5D6D55] text-white text-xs px-4 py-2 uppercase font-bold z-10 pointer-events-none">
                      Sold Out
                    </div>
                  )}
                  {product.isBestSeller && !product.isSoldOut && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] px-3 py-1 uppercase font-bold z-10 shadow-sm border border-gray-100 flex items-center gap-1 pointer-events-none">
                      <Sparkles size={10} className="text-[#F5A623]" /> Best Seller
                    </div>
                  )}
                  
                  {/* Hint overlay on mobile/tablet or when not hovering */}
                  <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 md:group-hover:opacity-0 transition-opacity">
                      <Sparkles size={16} className="text-gray-500" />
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:w-1/2">
            <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{product.category}</p>

            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center text-[#F5A623]">
                  {[1,2,3,4,5].map(star => (
                      <Star key={star} size={16} fill={star <= (product.rating || 5) ? "currentColor" : "none"} className={star <= (product.rating || 5) ? "" : "text-gray-300"} />
                  ))}
               </div>
               <span className="text-xs text-gray-500 underline cursor-pointer">Read Reviews</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
               <span className="text-2xl font-bold text-gray-800">₹{product.price.toLocaleString('en-IN')}</span>
               {product.originalPrice && (
                   <>
                     <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                     <span className="text-xs font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                     </span>
                   </>
               )}
            </div>
            
            <p className="text-gray-600 leading-relaxed font-light mb-8 border-b border-gray-100 pb-8">
                {product.description || "Experience the purity of nature with this meticulously crafted Ayurvedic formulation. Enriched with potent herbs and natural extracts, it provides deep nourishment."}
            </p>

            {/* Actions */}
            <div className="space-y-4 mb-10">
               {!product.isSoldOut ? (
                   <>
                       <div className="flex gap-4">
                           <div className="flex items-center border border-gray-300 w-32">
                               <button 
                                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                   <Minus size={16} />
                               </button>
                               <span className="flex-1 text-center font-bold text-gray-800">{quantity}</span>
                               <button 
                                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  onClick={() => setQuantity(quantity + 1)}
                                >
                                   <Plus size={16} />
                               </button>
                           </div>
                           <button 
                              onClick={handleAddToCart}
                              className="flex-1 bg-white border border-[#2C2C2C] text-[#2C2C2C] uppercase font-bold tracking-widest text-xs hover:bg-gray-50 transition-colors"
                           >
                              Add to Cart
                           </button>
                           <button
                             onClick={() => toggleWishlist(product)}
                             className={`w-12 flex items-center justify-center border transition-colors ${
                                 isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500'
                             }`}
                           >
                               <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                           </button>
                       </div>
                       <button 
                          onClick={handleBuyNow}
                          className="w-full bg-[#2C2C2C] text-white py-4 uppercase font-bold tracking-widest text-xs hover:bg-black transition-colors shadow-lg"
                       >
                          Buy Now
                       </button>
                   </>
               ) : (
                   <div className="bg-gray-100 p-4 text-center rounded-sm">
                       <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Out of Stock</span>
                       <p className="text-xs text-gray-400 mt-1">Notify me when available</p>
                   </div>
               )}
            </div>
            
            {/* --- FEATURE: FREQUENTLY BOUGHT TOGETHER --- */}
            {complementaryProduct && !complementaryProduct.isSoldOut && (
                <div className="mb-10 p-4 bg-[#FFFBF2] border border-[#8B7E66]/20 rounded-sm">
                    <h3 className="font-serif text-lg text-[#8B7E66] mb-3 flex items-center gap-2">
                        <Sparkles size={18} /> Complete Your Routine
                    </h3>
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={complementaryProduct.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{complementaryProduct.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Perfect match for {product.subCategory}</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">₹{complementaryProduct.price}</p>
                        </div>
                        <button 
                            onClick={() => {
                                addToCart(complementaryProduct);
                                showToast(`${complementaryProduct.name} added!`);
                            }}
                            className="bg-white border border-[#8B7E66] text-[#8B7E66] px-3 py-1.5 text-[10px] uppercase font-bold hover:bg-[#8B7E66] hover:text-white transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                </div>
            )}

            {/* Accordions */}
            <div className="border-t border-gray-200">
                {['Description', 'Ingredients', 'How to Use', 'Legal Info'].map((section) => (
                    <div key={section} className="border-b border-gray-200">
                        <button 
                            className="w-full flex items-center justify-between py-4 text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-[#8B7E66] transition-colors"
                            onClick={() => toggleSection(section.toLowerCase())}
                        >
                            {section}
                            {openSection === section.toLowerCase() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${
                            openSection === section.toLowerCase() ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            <div className="text-sm text-gray-600 leading-relaxed font-light">
                                {section === 'Description' && (product.fullDescription || product.description)}
                                {section === 'Ingredients' && (product.ingredients || "Full ingredient list not available.")}
                                {section === 'How to Use' && (product.howToUse || "Apply gently on affected area.")}
                                {section === 'Legal Info' && (
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-bold">Generic Name:</span> {product.legalInfo?.genericName || product.name}</p>
                                        <p><span className="font-bold">Country of Origin:</span> India</p>
                                        <p><span className="font-bold">Manufactured By:</span> Pure Elements, Pune, Maharashtra.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* USPs */}
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="flex items-center gap-3 bg-[#FFFBF2] p-3 rounded-sm">
                   <CheckCircle2 size={16} className="text-[#8B7E66]" />
                   <span className="text-xs font-bold uppercase text-gray-600">100% Ayurvedic</span>
               </div>
               <div className="flex items-center gap-3 bg-[#FFFBF2] p-3 rounded-sm">
                   <CheckCircle2 size={16} className="text-[#8B7E66]" />
                   <span className="text-xs font-bold uppercase text-gray-600">Cruelty Free</span>
               </div>
               <div className="flex items-center gap-3 bg-[#FFFBF2] p-3 rounded-sm">
                   <CheckCircle2 size={16} className="text-[#8B7E66]" />
                   <span className="text-xs font-bold uppercase text-gray-600">Paraben Free</span>
               </div>
               <div className="flex items-center gap-3 bg-[#FFFBF2] p-3 rounded-sm">
                   <CheckCircle2 size={16} className="text-[#8B7E66]" />
                   <span className="text-xs font-bold uppercase text-gray-600">Made in India</span>
               </div>
            </div>

          </div>
        </div>
        
        {/* --- FEATURE: RECENTLY VIEWED --- */}
        {recentlyViewed.length > 0 && (
            <div className="mt-20 border-t border-gray-100 pt-10">
                 <h4 className="font-bold text-gray-500 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Clock size={16} /> Recently Viewed
                 </h4>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {recentlyViewed.map(p => (
                         <div key={p.id} className="cursor-pointer group" onClick={() => onProductClick(p)}>
                             <div className="aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm mb-2">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                             </div>
                             <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#8B7E66]">{p.name}</p>
                             <p className="text-xs text-gray-500">₹{p.price}</p>
                         </div>
                    ))}
                 </div>
            </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-gray-100 pt-16">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl text-gray-800 relative inline-block">
                        You May Also Like
                        <span className="block h-px w-1/2 bg-[#8B7E66] mx-auto mt-4"></span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
