import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import SectionHeader from '../components/SectionHeader';
import CategoryCircle from '../components/CategoryCircle';
import ProductCarousel from '../components/ProductCarousel';
import RevealOnScroll from '../components/RevealOnScroll';
import { CONCERNS, TESTIMONIALS, STORES } from '../constants';
import { Play, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Slide, Category } from '../types';
import { productsService } from '../lib/database';
import ErrorState from '../components/ErrorState';

interface HomePageProps {
  heroSlides: Slide[];
  categories: Category[];
  onProductClick: (product: Product) => void;
}


const OFFER_IDS = [201, 202, 203, 204, 205, 206, 207, 208];

const HomePage: React.FC<HomePageProps> = ({ 
  heroSlides, 
  categories, 
  onProductClick 
}) => {
  const navigate = useNavigate();
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Bestsellers
            const bestsellers = await productsService.getBestsellers(5);
            setBestsellerProducts(bestsellers);

            // Fetch Featured
            const featured = await productsService.getFeatured();
            setFeaturedProducts(featured);

            // Fetch Offers
            const offers = await productsService.getByIds(OFFER_IDS);
            setOfferProducts(offers);
        } catch (error) {
            console.error("Error fetching homepage products:", error);
            setError("Failed to load some products. Please try refreshing the page.");
        }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO />
      <Hero slides={heroSlides} />

      {error && (
        <div className="container mx-auto px-4 py-8">
           <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      )}

      {/* Shop by Category */}
      <section className="py-10 md:py-16 container mx-auto px-4">
            <SectionHeader title="Category" subtitle="Shop by" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-6 justify-items-center max-w-6xl mx-auto">
              {categories.map(cat => (
                <div key={cat.id} onClick={() => navigate(`/shop/${cat.name.toUpperCase()}`)}>
                   <CategoryCircle category={cat} />
                </div>
              ))}
            </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <SectionHeader title="Featured Products" />
          <ProductCarousel 
            products={featuredProducts}
            onProductClick={onProductClick}
            itemsPerViewDesktop={4}
          />
        </div>
      </section>

      {/* Gifting Collection */}
      <section className="py-10 md:py-16 bg-brand-surface">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
              <SectionHeader title="Gifting Collection" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                 {/* Banner 1 */}
                 <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => navigate('/shop/GIFTING')}>
                    <img src="https://picsum.photos/id/1070/800/600" alt="Oudh" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-6 text-center">
                       <h3 className="font-serif text-2xl md:text-3xl mb-2">Oudh</h3>
                       <p className="text-[10px] uppercase tracking-[0.2em] opacity-90">Luxurious Ayurvedic Gift Set</p>
                    </div>
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronLeft size={16} className="text-white" />
                     </div>
                 </div>
                 
                 {/* Banner 2 */}
                 <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => navigate('/shop/GIFTING')}>
                    <img src="https://picsum.photos/id/1071/800/600" alt="Utsav" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-brand-primary/40 flex flex-col justify-center items-center text-white p-6 text-center">
                       <h3 className="font-serif text-2xl md:text-3xl mb-2">Utsav</h3>
                       <p className="text-[10px] uppercase tracking-[0.2em] opacity-90">A Set of Four Signature Perfumes</p>
                    </div>
                 </div>

                 {/* Banner 3 */}
                 <div className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer shadow-md" onClick={() => navigate('/shop/GIFTING')}>
                    <img src="https://picsum.photos/id/1072/800/600" alt="Pure Fragrances" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-brand-secondary/50 flex flex-col justify-center items-center text-white p-6 text-center">
                       <h3 className="font-serif text-2xl md:text-3xl mb-2">Sapphire</h3>
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
      <section className="py-10 md:py-16 container mx-auto px-4">
         <RevealOnScroll>
            <SectionHeader title="Shop By Concerns" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {CONCERNS.map((concern, idx) => (
                <div key={idx} className="relative aspect-[3/4] cursor-pointer group overflow-hidden bg-gray-200">
                   <img src={concern.image} alt={concern.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute bottom-0 left-0 right-0 bg-brand-primary/90 text-white py-3 md:py-4 text-center">
                      <h3 className="font-sans text-sm md:text-xl font-normal tracking-wide">{concern.title}</h3>
                   </div>
                </div>
              ))}
            </div>
         </RevealOnScroll>
      </section>

      {/* Bestsellers Section (Dynamic) */}
      <section className="py-10 md:py-16 bg-white">
         <div className="container mx-auto px-4">
            <RevealOnScroll>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Static Banner */}
                    <div className="w-full lg:w-1/3 relative overflow-hidden h-[300px] lg:h-auto group rounded-sm shadow-md">
                       <img src="/src/assets/bestsellers-bg.png" className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-1000" alt="Bestsellers" />
                       <div className="absolute inset-0 flex flex-col items-start justify-center p-8 bg-black/10">
                          <h2 className="text-white font-serif text-4xl md:text-5xl drop-shadow-lg text-left leading-tight mb-4">Our<br/>Bestsellers</h2>
                          <button onClick={() => navigate('/shop/BESTSELLERS')} className="bg-white text-black px-6 py-2 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors">
                            View All
                          </button>
                       </div>
                    </div>

                    {/* Right Product Carousel */}
                    <div className="w-full lg:w-2/3">
                       <ProductCarousel 
                           products={bestsellerProducts}
                           onProductClick={onProductClick}
                           itemsPerViewDesktop={3}
                       />
                    </div>
                </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* Large Promo Banner - Signature Perfumes */}
      <section className="w-full py-8 md:py-12">
         <RevealOnScroll>
            <div className="relative h-[350px] md:h-[450px] w-full bg-gray-900 flex items-center justify-end overflow-hidden" onClick={() => navigate('/shop/PERFUMES')}>
                <img src="https://picsum.photos/id/305/1920/800" alt="Perfume Collection" className="absolute w-full h-full object-cover opacity-60 cursor-pointer hover:scale-105 transition-transform duration-1000" />
                
               {/* Text Content Overlay */}
               <div className="relative z-10 w-full md:w-1/2 p-6 md:p-16 text-right md:text-left flex flex-col items-end md:items-start text-white pointer-events-none">
                  <h2 className="text-2xl md:text-5xl font-serif mb-4 leading-tight">Set of Signature Perfumes.<br/>Perfect Gift for Any Occasion.</h2>
                  
                  <div className="bg-brand-accent/95 text-white p-4 md:p-10 rounded-sm shadow-xl backdrop-blur-sm mt-4 md:mt-8 max-w-lg">
                     <p className="font-serif text-lg md:text-2xl font-medium leading-relaxed text-center">"Indulge in the essence of togetherness with our couple's perfume set."</p>
                  </div>
               </div>
            </div>
         </RevealOnScroll>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
           <RevealOnScroll>
              <div className="relative w-full aspect-video md:w-4/5 mx-auto shadow-2xl overflow-hidden group cursor-pointer border border-brand-primary/30">
                 <img src="https://picsum.photos/id/452/1280/720" alt="Video Thumbnail" className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-4 text-center">
                    <h2 className="font-serif text-2xl md:text-5xl text-brand-surface mb-2 md:mb-4 drop-shadow-xl tracking-wide">Soulful Scents of Pure Elements</h2>
                    <div className="flex items-center gap-4 mb-4 md:mb-8 scale-75 md:scale-100">
                       <span className="h-px w-12 bg-brand-surface"></span>
                       <p className="text-brand-surface tracking-[0.3em] uppercase text-sm font-bold">Luxury Collection</p>
                       <span className="h-px w-12 bg-brand-surface"></span>
                    </div>
                    <button className="bg-[#E60023] p-4 md:p-5 rounded-full hover:scale-110 transition-transform shadow-lg group-hover:shadow-red-900/50">
                       <Play fill="white" className="text-white h-6 w-6 md:h-8 md:w-8 ml-1" />
                    </button>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] md:text-xs font-bold bg-black/50 px-3 py-1 rounded">
                       <span>Watch on</span> <span className="font-bold">YouTube</span>
                    </div>
                 </div>
              </div>
           </RevealOnScroll>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
              <SectionHeader title="Offers" />
              <ProductCarousel 
                  products={offerProducts}
                  onProductClick={onProductClick}
                  variant="offer"
                  itemsPerViewDesktop={4}
              />
          </RevealOnScroll>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-10 md:py-16 bg-brand-surface">
         <div className="container mx-auto px-4">
            <RevealOnScroll>
               <SectionHeader title="Customer Testimonials" />
               <div className="text-center mb-6 md:mb-10 -mt-6">
                  <a href="#" className="text-brand-accent font-bold text-sm uppercase tracking-wide hover:underline">View All</a>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {TESTIMONIALS.map((t, i) => (
                     <div key={t.id} className="relative aspect-[9/16] bg-gray-800 overflow-hidden shadow-lg group cursor-pointer border border border-gray-200">
                        <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-[#FF0000] p-2 md:p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                              <Play fill="white" className="text-white ml-0.5 w-4 h-4 md:w-5 md:h-5" />
                           </div>
                        </div>
                        
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[8px] md:text-[10px] font-bold flex items-center gap-1 shadow-sm text-gray-800">
                           Subscribe
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                           <h4 className="text-white text-xs md:text-sm font-bold leading-tight mb-1 drop-shadow-md">REAL PEOPLE REAL STORIES</h4>
                           <div className="flex items-center gap-1 text-white/80 text-[8px] md:text-[10px]">
                              <Play className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" /> YouTube
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* Founder / About Section */}
      <section className="py-10 md:py-20 relative bg-white">
         <div className="container mx-auto px-4">
            <RevealOnScroll>
               <div className="relative rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px]">
                  {/* Text Content */}
                  <div className="w-full md:w-1/2 bg-brand-primary p-8 md:p-16 flex flex-col justify-center text-white relative z-10 order-2 md:order-1">
                     <div className="space-y-4 md:space-y-6">
                        <p className="text-base md:text-lg leading-relaxed font-light border-l-4 border-white/30 pl-4 md:pl-6">
                          Each product is meticulously crafted by <strong className="font-bold">Dr. Anand Mandhane, M.D. (Ayu Med)</strong>, drawing from over two decades of expertise.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed font-light border-l-4 border-white/30 pl-4 md:pl-6">
                          His profound understanding of ancient Ayurvedic herbs, paired with modern scientific insights, ensures that every formulation is <span className="font-serif italic text-xl">Potent, Pure and Safe.</span>
                        </p>
                        <button 
                          onClick={() => navigate('/about')}
                          className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-brand-primary transition-colors"
                        >
                          Read Our Story
                        </button>
                     </div>
                  </div>
                  {/* Image */}
                  <div className="w-full md:w-1/2 relative h-[300px] md:h-full order-1 md:order-2">
                     <img src="https://picsum.photos/id/1005/800/800" alt="Dr Anand" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary md:bg-gradient-to-r md:from-brand-primary md:to-transparent md:w-20"></div>
                  </div>
               </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* Values Grid */}
      <section className="py-10 md:py-16 bg-brand-surface">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[
                 { title: "Ingredients", sub: "Know More", img: "https://picsum.photos/id/112/500/500" },
                 { title: "Formulations", sub: "Know More", img: "https://picsum.photos/id/113/500/500" },
                 { title: "Efficacy", sub: "Know More", img: "https://picsum.photos/id/114/500/500" },
                 { title: "Safety", sub: "Know More", img: "https://picsum.photos/id/115/500/500" },
               ].map((item, idx) => (
                 <div key={idx} className="relative aspect-square group overflow-hidden shadow-lg cursor-pointer" onClick={() => navigate('/about')}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                       <div className="bg-brand-cream/90 backdrop-blur-sm p-2 md:p-6 w-5/6 h-5/6 md:w-3/4 md:h-3/4 flex flex-col items-center justify-center text-center border border-brand-primary/20">
                          <h3 className="font-serif text-lg md:text-2xl text-brand-dark italic mb-1 md:mb-3">{item.title}</h3>
                          <span className="text-[8px] md:text-[10px] uppercase border-b border-brand-dark pb-0.5 text-brand-dark tracking-wider">{item.sub}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Badges */}
      <section className="py-8 md:py-10 border-t border-b border-gray-200 bg-white">
         <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-16 text-gray-600">
            {['VEGAN', 'PARABEN FREE', 'CRUELTY FREE', 'SULFATE FREE', 'AYURVEDA'].map(badge => (
               <div key={badge} className="flex flex-col items-center gap-2 md:gap-3 group cursor-pointer min-w-[80px]">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-brand-secondary/30 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
                     <Leaf className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-brand-secondary transition-colors text-center">{badge}</span>
               </div>
            ))}
         </div>
      </section>

      {/* Stores */}
      <section className="py-12 md:py-20 bg-brand-light">
         <div className="container mx-auto px-4">
            <SectionHeader title="Our Exclusive Stores" />
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0">
               {STORES.map(store => (
                  <div key={store.id} className="min-w-[280px] md:min-w-[350px] bg-white shadow-lg snap-center group cursor-pointer first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0" onClick={() => navigate('/stores')}>
                     <div className="h-[180px] md:h-[220px] overflow-hidden relative">
                        <img src={store.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={store.name} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                     </div>
                     <div className="p-4 md:p-5 text-center bg-white border-t border-gray-100">
                        <h4 className="font-serif text-sm font-bold text-gray-800 leading-relaxed">{store.name}</h4>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </>
  );
};

export default HomePage;

