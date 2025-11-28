import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionHeader from './components/SectionHeader';
import CategoryCircle from './components/CategoryCircle';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import RevealOnScroll from './components/RevealOnScroll';
import CartDrawer from './components/CartDrawer';
import { CATEGORIES, FEATURED_PRODUCTS, CONCERNS, BESTSELLERS, TESTIMONIALS, STORES, OFFER_PRODUCTS } from './constants';
import { Play, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from './types';

type View = 'HOME' | 'LISTING' | 'PRODUCT';

function App() {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<string>('SKIN CARE');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleNavigate = (category: string, subCategory?: string) => {
    if (category === 'HOME') {
      setCurrentView('HOME');
      // Scroll to top
      window.scrollTo(0, 0);
      return;
    }
    
    // Non-navigable items just scroll to top or do nothing for now (like ABOUT US placeholder)
    if (category === 'ABOUT US' || category === 'STORES') {
       // Just for demo, maybe scroll to footer or stay home
       setCurrentView('HOME');
       return;
    }

    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    setCurrentView('LISTING');
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('PRODUCT');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] font-sans relative">
      <Navbar onNavigate={handleNavigate} />
      <CartDrawer />
      
      {currentView === 'HOME' && (
        <>
          <Hero />

          {/* Shop by Category */}
          <section className="py-16 container mx-auto px-4">
            <RevealOnScroll>
                <SectionHeader title="Category" subtitle="Shop by" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-10 gap-x-6 justify-items-center max-w-6xl mx-auto">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} onClick={() => handleNavigate(cat.name.toUpperCase())}>
                       <CategoryCircle category={cat} />
                    </div>
                  ))}
                </div>
            </RevealOnScroll>
          </section>

          {/* Featured Products */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <RevealOnScroll delay={200}>
                  <SectionHeader title="Featured Products" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {FEATURED_PRODUCTS.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        featured 
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Gifting Collection */}
          <section className="py-16 bg-[#F9F3E5]">
            <div className="container mx-auto px-4">
              <RevealOnScroll>
                  <SectionHeader title="Gifting Collection" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {/* Banner 1 */}
                     <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => handleNavigate('GIFTING')}>
                        <img src="https://picsum.photos/id/1070/800/600" alt="Oudh" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-6 text-center">
                           <h3 className="font-serif text-3xl mb-2">Oudh</h3>
                           <p className="text-[10px] uppercase tracking-[0.2em] opacity-90">Luxurious Ayurvedic Gift Set</p>
                        </div>
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <ChevronLeft size={16} className="text-white" />
                         </div>
                     </div>
                     
                     {/* Banner 2 */}
                     <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => handleNavigate('GIFTING')}>
                        <img src="https://picsum.photos/id/1071/800/600" alt="Utsav" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-brand-primary/40 flex flex-col justify-center items-center text-white p-6 text-center">
                           <h3 className="font-serif text-3xl mb-2">Utsav</h3>
                           <p className="text-[10px] uppercase tracking-[0.2em] opacity-90">A Set of Four Signature Perfumes</p>
                        </div>
                     </div>

                     {/* Banner 3 */}
                     <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => handleNavigate('GIFTING')}>
                        <img src="https://picsum.photos/id/1072/800/600" alt="Pure Fragrances" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-[#5D6D55]/50 flex flex-col justify-center items-center text-white p-6 text-center">
                           <h3 className="font-serif text-3xl mb-2">Sapphire</h3>
                           <p className="text-[10px] uppercase tracking-[0.2em] opacity-90">Luxurious Ayurvedic Gift Set</p>
                        </div>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <ChevronRight size={16} className="text-white" />
                         </div>
                     </div>
                  </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Shop By Concerns */}
          <section className="py-16 container mx-auto px-4">
             <RevealOnScroll>
                <SectionHeader title="Shop By Concerns" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {CONCERNS.map((concern, idx) => (
                    <div key={idx} className="relative aspect-[3/4] cursor-pointer group overflow-hidden bg-gray-200">
                       <img src={concern.image} alt={concern.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute bottom-0 left-0 right-0 bg-[#C69C6D]/90 text-white py-4 text-center">
                           <h3 className="font-sans text-lg md:text-xl font-normal tracking-wide">{concern.title}</h3>
                       </div>
                    </div>
                  ))}
                </div>
             </RevealOnScroll>
          </section>

          {/* Bestsellers Section (Split Layout) */}
          <section className="py-16 bg-white">
             <div className="container mx-auto px-4">
                 <RevealOnScroll>
                     <div className="flex flex-col lg:flex-row gap-8">
                         {/* Left Static Banner */}
                         <div className="lg:w-1/3 relative overflow-hidden h-[400px] lg:h-auto group">
                            <img src="https://picsum.photos/id/201/600/800" className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-1000" alt="Bestsellers" />
                            <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/10">
                               <h2 className="text-white font-serif text-4xl md:text-5xl drop-shadow-lg text-center leading-tight">Our<br/>Bestsellers</h2>
                            </div>
                         </div>

                         {/* Right Product Grid */}
                         <div className="lg:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                                {BESTSELLERS.map((product, index) => (
                                   <div key={product.id} style={{ transitionDelay: `${index * 100}ms` }} className="h-full">
                                        <ProductCard 
                                            product={product} 
                                            onClick={() => handleProductClick(product)}
                                        />
                                   </div>
                                ))}
                            </div>
                         </div>
                     </div>
                 </RevealOnScroll>
             </div>
          </section>

          {/* Large Promo Banner - Signature Perfumes */}
          <section className="w-full py-12">
             <RevealOnScroll>
                 <div className="relative h-[450px] w-full bg-gray-900 flex items-center justify-end overflow-hidden" onClick={() => handleNavigate('PERFUMES')}>
                     <img src="https://picsum.photos/id/305/1920/800" alt="Perfume Collection" className="absolute w-full h-full object-cover opacity-60 cursor-pointer hover:scale-105 transition-transform duration-1000" />
                     
                     {/* Text Content Overlay */}
                     <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16 text-right md:text-left flex flex-col items-end md:items-start text-white pointer-events-none">
                         <h2 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">Set of Signature Perfumes.<br/>Perfect Gift for Any Occasion.</h2>
                         
                         <div className="bg-[#F4A460]/95 text-white p-6 md:p-10 rounded-sm shadow-xl backdrop-blur-sm mt-8 max-w-lg">
                             <p className="font-serif text-xl md:text-2xl font-medium leading-relaxed text-center">"Indulge in the essence of togetherness with our couple's perfume set."</p>
                         </div>
                     </div>
                 </div>
             </RevealOnScroll>
          </section>

          {/* Video Section */}
          <section className="py-20 bg-[#2D241E] text-white">
            <div className="container mx-auto px-4">
               <RevealOnScroll>
                   <div className="relative w-full aspect-video md:w-4/5 mx-auto shadow-2xl overflow-hidden group cursor-pointer border border-[#8B7E66]/30">
                      <img src="https://picsum.photos/id/452/1280/720" alt="Video Thumbnail" className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                         <h2 className="font-serif text-3xl md:text-5xl text-[#EBD9B6] mb-4 text-center drop-shadow-xl tracking-wide">Soulful Scents of Pure Elements</h2>
                         <div className="flex items-center gap-4 mb-8">
                             <span className="h-px w-12 bg-[#EBD9B6]"></span>
                             <p className="text-[#EBD9B6] tracking-[0.3em] uppercase text-sm font-bold">Luxury Collection</p>
                             <span className="h-px w-12 bg-[#EBD9B6]"></span>
                         </div>
                         <button className="bg-[#E60023] p-5 rounded-full hover:scale-110 transition-transform shadow-lg group-hover:shadow-red-900/50">
                            <Play fill="white" className="text-white h-8 w-8 ml-1" />
                         </button>
                         <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-bold bg-black/50 px-3 py-1 rounded">
                            <span>Watch on</span> <span className="font-bold">YouTube</span>
                         </div>
                      </div>
                   </div>
               </RevealOnScroll>
            </div>
          </section>

          {/* Offers Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <RevealOnScroll>
                  <SectionHeader title="Offers" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {OFFER_PRODUCTS.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        variant="offer" 
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Customer Testimonials */}
          <section className="py-16 bg-[#FFFBF2]">
             <div className="container mx-auto px-4">
                <RevealOnScroll>
                    <SectionHeader title="Customer Testimonials" />
                    <div className="text-center mb-10 -mt-6">
                       <a href="#" className="text-[#E48B47] font-bold text-sm uppercase tracking-wide hover:underline">View All</a>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {TESTIMONIALS.map((t, i) => (
                          <div key={t.id} className="relative aspect-[9/16] bg-gray-800 overflow-hidden shadow-lg group cursor-pointer border border border-gray-200">
                             <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                             
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-[#FF0000] p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                                   <Play fill="white" size={20} className="text-white ml-0.5" />
                                </div>
                             </div>
                             
                             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm text-gray-800">
                                Subscribe
                             </div>
                             <div className="absolute top-3 left-3 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-primary overflow-hidden">
                                   <img src="https://picsum.photos/id/64/50/50" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-white text-[10px] font-bold shadow-black drop-shadow-md">Pure Elements</span>
                             </div>
                             
                             <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-white text-sm font-bold leading-tight mb-1 drop-shadow-md">REAL PEOPLE REAL STORIES</h4>
                                <div className="flex items-center gap-1 text-white/80 text-[10px]">
                                   <Play size={10} fill="currentColor" /> YouTube
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                </RevealOnScroll>
             </div>
          </section>

          {/* Founder / About Section */}
          <section className="py-20 relative bg-white">
             <div className="container mx-auto px-4">
                 <RevealOnScroll>
                     <div className="relative rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px]">
                         {/* Text Content */}
                         <div className="md:w-1/2 bg-[#C19A6B] p-10 md:p-16 flex flex-col justify-center text-white relative z-10">
                            <div className="space-y-6">
                                <p className="text-base md:text-lg leading-relaxed font-light border-l-4 border-white/30 pl-6">
                                  Each product is meticulously crafted by <strong className="font-bold">Dr. Anand Mandhane, M.D. (Ayu Med)</strong>, drawing from over two decades of expertise.
                                </p>
                                <p className="text-base md:text-lg leading-relaxed font-light border-l-4 border-white/30 pl-6">
                                  His profound understanding of ancient Ayurvedic herbs, paired with modern scientific insights, ensures that every formulation is <span className="font-serif italic text-xl">Potent, Pure and Safe.</span>
                                </p>
                            </div>
                         </div>
                         {/* Image */}
                         <div className="md:w-1/2 relative h-[400px] md:h-full">
                            <img src="https://picsum.photos/id/1005/800/800" alt="Dr Anand" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#C19A6B] to-transparent md:w-20"></div>
                         </div>
                     </div>
                 </RevealOnScroll>
             </div>
          </section>

          {/* Values Grid */}
          <section className="py-16 bg-[#FFFBF2]">
             <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                     { title: "Ingredients", sub: "Know More", img: "https://picsum.photos/id/112/500/500" },
                     { title: "Formulations", sub: "Know More", img: "https://picsum.photos/id/113/500/500" },
                     { title: "Efficacy", sub: "Know More", img: "https://picsum.photos/id/114/500/500" },
                     { title: "Safety", sub: "Know More", img: "https://picsum.photos/id/115/500/500" },
                   ].map((item, idx) => (
                     <div key={idx} className="relative aspect-square group overflow-hidden shadow-lg cursor-pointer">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                           <div className="bg-brand-cream/90 backdrop-blur-sm p-6 w-3/4 h-3/4 flex flex-col items-center justify-center text-center border border-[#8B7E66]/20">
                               <h3 className="font-serif text-2xl text-[#5D4037] italic mb-3">{item.title}</h3>
                               <span className="text-[10px] uppercase border-b border-[#5D4037] pb-0.5 text-[#5D4037] tracking-wider">{item.sub}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Badges */}
          <section className="py-10 border-t border-b border-gray-200 bg-white">
             <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-600">
                 {['VEGAN', 'PARABEN FREE', 'CRUELTY FREE', 'SULFATE FREE', 'AYURVEDA'].map(badge => (
                    <div key={badge} className="flex flex-col items-center gap-3 group cursor-pointer">
                       <div className="w-14 h-14 rounded-full border border-brand-secondary/30 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
                          <Leaf size={24} strokeWidth={1.5} />
                       </div>
                       <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-brand-secondary transition-colors">{badge}</span>
                    </div>
                 ))}
             </div>
          </section>

          {/* Stores */}
          <section className="py-20 bg-[#F4F4F4]">
             <div className="container mx-auto px-4">
                <SectionHeader title="Our Exclusive Stores" />
                <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory px-4 md:px-0">
                   {STORES.map(store => (
                      <div key={store.id} className="min-w-[300px] md:min-w-[350px] bg-white shadow-lg snap-center group cursor-pointer">
                         <div className="h-[220px] overflow-hidden relative">
                            <img src={store.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={store.name} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                         </div>
                         <div className="p-5 text-center bg-white border-t border-gray-100">
                            <h4 className="font-serif text-sm font-bold text-gray-800 leading-relaxed">{store.name}</h4>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </section>
        </>
      )}

      {currentView === 'LISTING' && (
        <ProductListing 
          initialCategory={selectedCategory} 
          initialSubCategory={selectedSubCategory}
          onNavigate={handleNavigate}
          onProductClick={handleProductClick}
        />
      )}

      {currentView === 'PRODUCT' && selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onNavigate={handleNavigate}
          onProductClick={handleProductClick}
        />
      )}

      <Footer />
      
      {/* Floating Whatsapp Button */}
      <a href="#" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-50 hover:bg-[#128C7E] transition-colors group">
         <div className="relative">
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#25D366]"></div>
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.87 3.05.87 3.182 0 5.77-2.587 5.769-5.766.001-3.182-2.584-5.768-5.768-5.768zm9.263 4.943c-1.014-2.688-3.375-4.727-6.216-5.366-2.883-.647-5.916.315-7.986 2.522-2.062 2.201-2.73 5.305-1.776 8.163.791 2.375 2.809 4.27 5.258 4.94.464.126.936.196 1.408.196 1.77 0 3.491-.689 4.785-1.921 2.193-2.086 3.033-5.3 2.181-8.31l-2.344.776c.642 2.26.012 4.673-1.636 6.241-.973.926-2.268 1.444-3.599 1.444-.356 0-.712-.054-1.062-.149-1.839-.503-3.355-1.926-3.95-3.709-.716-2.148-.214-4.481 1.334-6.135 1.555-1.658 3.834-2.381 6.002-1.895 2.134.48 3.908 2.012 4.67 4.031l2.337-.777z"/></svg>
         </div>
         <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs py-1 px-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Chat with us</span>
      </a>
    </div>
  );
}

export default App;