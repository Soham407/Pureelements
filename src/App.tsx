import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';
import AboutUs from './components/AboutUs';
import StoresPage from './components/StoresPage';
import CheckoutPage from './components/CheckoutPage';
import InfoPage from './components/InfoPage';
import BlogPage from './components/BlogPage';
import ContactPage from './components/ContactPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import { CATEGORIES, FEATURED_PRODUCTS, BESTSELLERS, NAV_ITEMS, INITIAL_SLIDES, ALL_PRODUCTS, OFFER_PRODUCTS } from './constants';
import Loader from './components/Loader';
import { Product, Order, NavItem, Slide, Category } from './types';
import { useCart } from './contexts/CartContext';
import { productsService, navItemsService, heroSlidesService, categoriesService, ordersService } from './lib/database';

// AppContent component that uses Routes
function AppContent() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // State for Dynamic CMS
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>(NAV_ITEMS);
  const [heroSlides, setHeroSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  
  const { closeCart } = useCart();

  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          console.warn('Supabase not configured. Using fallback data.');
          // Use fallback data from constants
          setAllProducts(ALL_PRODUCTS);
          setBestsellerProducts(BESTSELLERS);
          setIsLoading(false);
          return;
        }

        // Load products (fetch more for admin dashboard - we'll implement server-side pagination later if needed)
        const { products } = await productsService.getAll(1, 1000);
        setAllProducts(products);

        // Load bestsellers from backend
        try {
          const bestsellers = await productsService.getBestsellers(5);
          if (bestsellers.length > 0) {
            setBestsellerProducts(bestsellers);
          } else {
            // Fallback to static bestsellers if no orders exist yet
            setBestsellerProducts(BESTSELLERS);
          }
        } catch (error) {
          console.warn('Error loading bestsellers, using fallback:', error);
          setBestsellerProducts(BESTSELLERS);
        }

        // Load nav items
        const nav = await navItemsService.getAll();
        if (nav.length > 0) {
          setNavItems(nav);
        }

        // Load hero slides
        const slides = await heroSlidesService.getAll();
        if (slides.length > 0) {
          setHeroSlides(slides);
        }

        // Load categories
        const cats = await categoriesService.getAll();
        if (cats.length > 0) {
          setCategories(cats);
        }

        // Load orders (for admin only)
        const orders = await ordersService.getAll();
        setAllOrders(orders);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Fallback to constants if Supabase fails
        setAllProducts(ALL_PRODUCTS);
        setBestsellerProducts(BESTSELLERS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigate = (category: string, subCategory?: string, search?: string) => {
    // Handle specific static routes
    if (category === 'HOME') {
      navigate('/');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'PROFILE') {
      navigate('/profile');
        window.scrollTo(0, 0);
        return;
    }

    if (category === 'ABOUT US') {
      navigate('/about');
        window.scrollTo(0, 0);
        return;
    }
    
    if (category === 'STORES') {
      navigate('/stores');
       window.scrollTo(0, 0);
       return;
    }

    if (category === 'CHECKOUT') {
      navigate('/cart');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'BLOG') {
      navigate('/blog');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'CONTACT') {
      navigate('/contact');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'PRIVACY') {
      navigate('/privacy');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'TERMS') {
      navigate('/terms');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'SHIPPING') {
      navigate('/shipping');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'PAYMENT') {
      navigate('/payment');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'REFUND') {
      navigate('/refund');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'ADMIN') {
      navigate('/admin');
      window.scrollTo(0, 0);
      return;
    }

    if (category === 'SEARCH' && search) {
      navigate(`/shop/SEARCH?q=${encodeURIComponent(search)}`);
        window.scrollTo(0, 0);
        return;
    }

    // Default to Listing View for Categories
    if (subCategory) {
      navigate(`/shop/${category}?subCategory=${subCategory}`);
    } else {
      navigate(`/shop/${category}`);
    }
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/cart');
    window.scrollTo(0, 0);
  };

  // --- ACTIONS ---
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const updated = await productsService.update(updatedProduct.id, updatedProduct);
      setAllProducts(prev => prev.map(p => p.id === updatedProduct.id ? updated : p));
    } catch (error: any) {
      console.error('Error updating product:', error);
      // Re-throw with more context if needed
      throw new Error(error?.message || 'Failed to update product');
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const { id, ...productData } = newProduct;
      const created = await productsService.create(productData);
      setAllProducts(prev => [created, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updated = await ordersService.updateStatus(orderId, status);
      setAllOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const handleAddOrder = async (newOrder: Order) => {
    // This will be handled by CheckoutPage with proper user_id
    setAllOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateNav = async (updatedNavItems: NavItem[]) => {
    try {
      const updated = await navItemsService.updateAll(updatedNavItems);
      setNavItems(updated);
    } catch (error) {
      console.error('Error updating nav items:', error);
      throw error;
    }
  };

  const handleUpdateHero = async (updatedSlides: Slide[]) => {
    try {
      const updated = await heroSlidesService.updateAll(updatedSlides);
      setHeroSlides(updated);
    } catch (error) {
      console.error('Error updating hero slides:', error);
      throw error;
    }
  };

  // Optimized Filtered lists for Home Page using useMemo
  const featuredProducts = useMemo(() => 
    allProducts.filter(p => FEATURED_PRODUCTS.some(fp => fp.id === p.id)),
  [allProducts]);

  const offerProducts = useMemo(() => 
    allProducts.filter(p => OFFER_PRODUCTS.some(op => op.id === p.id)),
  [allProducts]);

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

      return (
    <div className="min-h-screen bg-[#FFFBF2] font-sans relative overflow-x-hidden pt-[100px] lg:pt-[160px]">
      {!isAdminRoute && <Navbar onNavigate={handleNavigate} navItems={navItems} />}
      {!isAdminRoute && <CartDrawer onCheckout={handleCheckoutClick} />}
      <AuthModal />
      
      <Routes>
        <Route path="/" element={
          <HomePage
            heroSlides={heroSlides}
            categories={categories}
            allProducts={allProducts}
            bestsellerProducts={bestsellerProducts}
            onProductClick={handleProductClick}
          />
        } />
        
        <Route path="/shop/:category" element={
          <ProductListingPage
            allProducts={allProducts}
            navItems={navItems}
            onProductClick={handleProductClick}
          />
        } />
        
        <Route path="/product/:id" element={
          <ProductDetailsPage
            allProducts={allProducts}
            onProductClick={handleProductClick}
          />
        } />
        
        <Route path="/cart" element={
          <CheckoutPage
            onNavigateHome={() => handleNavigate('HOME')}
            onPlaceOrder={handleAddOrder}
          />
        } />
        
        <Route path="/profile" element={
          <ProfilePage onProductClick={handleProductClick} />
        } />
        
        <Route path="/about" element={<AboutUs />} />
        
        <Route path="/stores" element={<StoresPage />} />
        
        <Route path="/blog" element={<BlogPage />} />
        
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="/privacy" element={<InfoPage type="PRIVACY" />} />
        
        <Route path="/terms" element={<InfoPage type="TERMS" />} />
        
        <Route path="/shipping" element={<InfoPage type="SHIPPING" />} />
        
        <Route path="/payment" element={<InfoPage type="PAYMENT" />} />
        
        <Route path="/refund" element={<InfoPage type="REFUND" />} />
        
        <Route path="/admin" element={
          !isAdminLoggedIn ? (
        <AdminLogin 
          onLogin={() => setIsAdminLoggedIn(true)} 
          onCancel={() => handleNavigate('HOME')} 
        />
          ) : (
      <AdminLayout 
        products={allProducts} 
        orders={allOrders}
        navItems={navItems}
        slides={heroSlides}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateNav={handleUpdateNav}
        onUpdateHero={handleUpdateHero}
        onExitAdmin={() => {
          setIsAdminLoggedIn(false);
          handleNavigate('HOME');
        }}
      />
          )
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}
      
      {/* Floating Whatsapp Button */}
      <a href="#" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-50 hover:bg-[#128C7E] transition-colors group">
         <div className="relative">
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#25D366]"></div>
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.87 3.05.87 3.182 0 5.77-2.587 5.769-5.766.001-3.182-2.584-5.768-5.768-5.768zm9.263 4.943c-1.014-2.688-3.375-4.727-6.216-5.366-2.883-.647-5.916.315-7.986 2.522-2.062 2.201-2.73 5.305-1.776 8.163.791 2.375 2.809 4.27 5.258 4.94.464.126.936.196 1.408.196 1.77 0 3.491-.689 4.785-1.921 2.193-2.086 3.033-5.3 2.181-8.31l-2.344.776c.642 2.26.012 4.673-1.636 6.241-.973.926-2.268 1.444-3.599 1.444-.356 0-.712-.054-1.062-.149-1.839-.503-3.355-1.926-3.95-3.709-.716-2.148-.214-4.481 1.334-6.135 1.555-1.658 3.834-2.381 6.002-1.895 2.134.48 3.908 2.012 4.67 4.031l2.337-.777z"/></svg>
         </div>
         <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs py-1 px-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">Chat with us</span>
      </a>
    </div>
  );
}

// Main App component that wraps everything in BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
