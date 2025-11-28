
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Star, Minus, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, Heart } from 'lucide-react';
import { useCart } from '../CartContext';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../constants';
import { useToast } from '../ToastContext';
import { useWishlist } from '../WishlistContext';

interface Props {
  product: Product;
  onNavigate: (category: string, subCategory?: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductDetails: React.FC<Props> = ({ product, onNavigate, onProductClick }) => {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('description');

  const isWishlisted = isInWishlist(product.id);

  // Related products: same main category, exclude current
  const relatedProducts = ALL_PRODUCTS
    .filter(p => p.mainCategory === product.mainCategory && p.id !== product.id)
    .slice(0, 4);

  // Reset state when product changes
  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
    setOpenSection('description');
    window.scrollTo(0, 0);
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  const handleWishlistClick = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
        showToast('Added to wishlist', 'info');
    } else {
        showToast('Removed from wishlist', 'info');
    }
  };

  const images = product.images && product.images.length > 0 
    ? [product.image, ...product.images] 
    : [product.image];

  const uniqueImages = Array.from(new Set(images));

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in font-sans pb-16">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Left: Product Images */}
          <div className="md:w-1/2 w-full md:sticky md:top-24">
            <div className="relative aspect-square bg-[#F7F7F7] mb-4 overflow-hidden group rounded-sm border border-gray-100">
               <img src={activeImage} alt={product.name} className="w-full h-full object-cover p-1" />
               <button 
                  onClick={handleWishlistClick}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow-sm bg-white transition-colors hover:bg-gray-50 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
               >
                   <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
               </button>
               
               {/* Arrow Navigation (Mock) */}
               <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-pointer hover:bg-black/5 rounded-full">
                    <ChevronLeft size={20} className="text-gray-500" />
               </div>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 cursor-pointer hover:bg-black/5 rounded-full">
                    <ChevronRight size={20} className="text-gray-500" />
               </div>
            </div>
            
            {uniqueImages.length > 1 && (
               <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {uniqueImages.map((img, idx) => (
                     <div 
                        key={idx} 
                        className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer border rounded-sm overflow-hidden transition-all ${activeImage === img ? 'border-[#F5A623] opacity-100 ring-1 ring-[#F5A623]' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                        onClick={() => setActiveImage(img)}
                     >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                     </div>
                  ))}
               </div>
            )}

            {/* Stacked Marketing Images (if available) */}
             {product.marketingImages && product.marketingImages.length > 0 && (
                <div className="mt-8 space-y-4">
                   {product.marketingImages.map((img, idx) => (
                      <div key={idx} className="w-full rounded-sm overflow-hidden shadow-sm">
                         <img src={img} alt="Product Lifestyle" className="w-full h-auto" />
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* Right: Product Details */}
          <div className="md:w-1/2 w-full flex flex-col">
            {product.isBestSeller && (
                 <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 uppercase tracking-widest self-start mb-2 border border-red-100">Bestseller</span>
            )}
            <p className="text-xs font-bold text-[#8B7E66] tracking-widest uppercase mb-2">
                {product.subCategory || product.category}
            </p>
            <h1 className="text-2xl md:text-4xl font-serif text-gray-800 mb-3 md:mb-4 leading-tight">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-6">
                {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className={`${s <= (product.rating || 0) ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-2">({product.rating || 0} Reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                )}
                {product.originalPrice && (
                    <span className="text-sm font-bold text-green-600">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                )}
            </div>
            
            {product.size && (
                <p className="text-sm text-gray-600 mb-4 font-medium">Size: {product.size}</p>
            )}
            <p className="text-xs text-gray-500 mb-8">(inclusive of all taxes)</p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex items-center justify-between md:justify-start border border-gray-300 rounded-sm">
                        <button onClick={() => handleQuantityChange(-1)} className="px-3 py-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50" disabled={quantity <= 1}>
                            <Minus size={14} />
                        </button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="w-12 text-center py-2 text-gray-800 font-bold outline-none border-x border-gray-300"
                        />
                        <button onClick={() => handleQuantityChange(1)} className="px-3 py-3 hover:bg-gray-50 text-gray-600">
                            <Plus size={14} />
                        </button>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={product.isSoldOut}
                        className={`flex-1 px-8 py-3.5 font-bold text-sm uppercase tracking-widest transition-colors shadow-lg rounded-sm ${
                            product.isSoldOut 
                            ? 'bg-gray-300 text-white cursor-not-allowed' 
                            : 'bg-[#8B7E66] text-white hover:bg-[#7A6D55]'
                        }`}
                    >
                        {product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
                
                {!product.isSoldOut && (
                    <button 
                        onClick={handleBuyNow}
                        className="w-full px-8 py-3.5 font-bold text-sm uppercase tracking-widest transition-colors shadow-lg rounded-sm bg-[#2C2C2C] text-white hover:bg-black"
                    >
                        Buy Now
                    </button>
                )}
            </div>

            {/* Expanded Description for Special Products */}
            {product.fullDescription ? (
                <div className="mb-8">
                    <h3 className="font-serif text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Product Description</h3>
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.fullDescription}
                    </div>
                </div>
            ) : (
                /* Standard Accordions */
                <div className="border-t border-gray-200 mt-4">
                    {/* Description */}
                    <div className="border-b border-gray-200">
                        <button 
                            className="w-full py-4 flex items-center justify-between text-left group"
                            onClick={() => toggleSection('description')}
                        >
                            <span className="font-serif font-bold text-gray-800">Description</span>
                            {openSection === 'description' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'description' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="border-b border-gray-200">
                        <button 
                            className="w-full py-4 flex items-center justify-between text-left group"
                            onClick={() => toggleSection('ingredients')}
                        >
                            <span className="font-serif font-bold text-gray-800">Key Ingredients</span>
                            {openSection === 'ingredients' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'ingredients' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients || "Natural Ayurvedic Ingredients"}</p>
                        </div>
                    </div>

                    {/* How To Use */}
                    <div className="border-b border-gray-200">
                        <button 
                            className="w-full py-4 flex items-center justify-between text-left group"
                            onClick={() => toggleSection('howToUse')}
                        >
                            <span className="font-serif font-bold text-gray-800">How to Use</span>
                            {openSection === 'howToUse' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'howToUse' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.howToUse || "Apply gently on affected area."}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Badges */}
            <div className="flex gap-6 mt-8 py-6 grayscale opacity-80 flex-wrap">
                 <div className="flex flex-col items-center gap-1">
                     <CheckCircle2 size={24} className="text-[#5D6D55]" />
                     <span className="text-[10px] uppercase font-bold text-gray-500">Vegan</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <CheckCircle2 size={24} className="text-[#5D6D55]" />
                     <span className="text-[10px] uppercase font-bold text-gray-500">Cruelty Free</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <CheckCircle2 size={24} className="text-[#5D6D55]" />
                     <span className="text-[10px] uppercase font-bold text-gray-500">Paraben Free</span>
                 </div>
            </div>

             {/* Legal Footer (Optional) */}
            {product.legalInfo && (
                <div className="mt-10 bg-gray-50 p-6 rounded-sm text-[10px] text-gray-500 leading-relaxed border-t border-gray-100">
                    <p className="mb-2"><strong className="text-gray-700">Generic name :</strong> {product.legalInfo.genericName || "Ayurvedic Cosmetic"}</p>
                    {product.legalInfo.usp && <p className="mb-2"><strong className="text-gray-700">USP :</strong> {product.legalInfo.usp}</p>}
                    {product.legalInfo.bestBefore && <p className="mb-2"><strong className="text-gray-700">Best before :</strong> {product.legalInfo.bestBefore}</p>}
                    <p className="mb-2"><strong className="text-gray-700">Developed & Marketed by :</strong> {product.legalInfo.manufacturedBy || "Pure Elements Wellness Solutions"}</p>
                    {product.legalInfo.mfgLicNo && <p className="mb-2"><strong className="text-gray-700">Mfg.lic.no:</strong> {product.legalInfo.mfgLicNo}</p>}
                    <p className="mb-2"><strong className="text-gray-700">Country of origin :</strong> {product.legalInfo.countryOfOrigin || "India"}</p>
                    <p className="mb-2"><strong className="text-gray-700">Customer care number :</strong> 9021099099</p>
                    <p className="mb-4"><strong className="text-gray-700">In case of feedback or complaints –</strong> email: customercare@pureelements.in</p>
                    <p className="italic opacity-70">
                        <strong>Disclaimer –</strong><br/>
                        -This perfume is for external use only. Avoid direct contact with eyes, mouth, and broken or irritated skin.<br/>
                        -Store in a cool, dry place, away from direct sunlight and extreme temperatures.<br/>
                        -Fragrance longevity and projection may vary depending on individual skin type, weather, and application methods.
                    </p>
                </div>
            )}

          </div>
        </div>

        {/* You May Also Like */}
        <section className="mt-16 md:mt-20">
            <h3 className="font-serif text-2xl md:text-3xl text-center mb-8 md:mb-10 text-gray-800 relative inline-block w-full">
                <span className="bg-white relative z-10 px-6">You may also like</span>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p, i) => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={() => onProductClick(p)}
                    />
                ))}
            </div>
        </section>

      </div>
    </div>
  );
};

export default ProductDetails;
