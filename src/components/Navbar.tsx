
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  navItems: NavItem[];
  onNavigate: (category: string, subCategory?: string, searchQuery?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navItems, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use useRef to track scroll position without triggering re-renders of the effect
  const lastScrollY = useRef(0);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { cartCount, openCart } = useCart();
  const { openAuthModal, isAuthenticated, user } = useAuth();

  useEffect(() => {
    let ticking = false;
    const controlNavbar = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isOpen) return;

          const currentScrollY = window.scrollY;

          // Always show if at the top
          if (currentScrollY < 10) {
            setIsVisible(true);
            setIsScrolled(false);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          setIsScrolled(true);

          // Logic: Hide if scrolling down, Show if scrolling up
          if (currentScrollY > lastScrollY.current) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isOpen]);

  const handleNavClick = (name: string, subItem?: string) => {
    setSearchTerm(''); // Clear search when navigating
    onNavigate(name, subItem);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      onNavigate('SEARCH', undefined, searchTerm);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      onNavigate('PROFILE');
    } else {
      openAuthModal();
    }
  };

  return (
    <nav 
      className={`bg-white fixed top-0 z-50 font-sans w-full transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'shadow-md' : 'shadow-none'}`}
    >
      {/* Top Row: Search, Logo, Actions */}
      <div className="container mx-auto px-4 pt-4 pb-4 md:pt-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
          
          {/* Left: Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center w-full lg:w-1/3">
            <div className="flex w-full max-w-[280px]">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full border border-gray-200 border-r-0 px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-300 rounded-l-sm bg-white"
              />
              <button 
                onClick={handleSearchSubmit}
                className="bg-brand-accent px-4 py-2 flex items-center justify-center hover:bg-[#E0B83E] transition-colors rounded-r-sm"
              >
                <Search className="h-5 w-5 text-gray-800" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Center: Logo (Mobile & Desktop) */}
          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-center lg:flex-grow">
            <button className="lg:hidden p-2 -ml-2 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center justify-center gap-3 cursor-pointer select-none" onClick={() => handleNavClick('HOME')}>
              {/* Logo Icon Placeholder */}
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-[3px] border-gray-500 p-0.5 flex-shrink-0 flex items-center justify-center">
                 <div className="w-full h-full rounded-full bg-brand-accent border-[2px] border-white"></div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col items-start">
                <h1 className="text-xl lg:text-3xl font-sans text-[#4A4A4A] uppercase tracking-wide leading-none" style={{ fontWeight: 400 }}>
                  PURE ELEMENTS
                  <sup className="text-[8px] lg:text-[10px] top-[-0.5em] ml-0.5 text-gray-400">TM</sup>
                </h1>
                <span className="text-[8px] lg:text-[11px] tracking-[0.35em] text-black uppercase font-medium mt-1 w-full text-justify">
                  PROMISE OF AYURVEDA
                </span>
              </div>
            </div>

            {/* Mobile Cart Icon */}
            <div className="lg:hidden relative mr-1 cursor-pointer" onClick={openCart}>
              <ShoppingCart className="h-6 w-6 text-brand-secondary" />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-secondary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </div>
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden lg:flex items-center justify-end w-full lg:w-1/3 gap-6">
            <div className="relative group cursor-pointer" onClick={openCart}>
              <ShoppingCart className="h-7 w-7 text-brand-secondary" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            </div>
            
            <div className="cursor-pointer hover:opacity-70 flex items-center gap-2" onClick={handleUserIconClick}>
              <User className="h-7 w-7 text-gray-500" strokeWidth={1.2} />
              {isAuthenticated && (
                <span className="text-xs font-bold text-gray-600 uppercase hidden xl:block">
                    Hi, {user?.name.split(' ')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className={`w-full h-[1px] bg-brand-accent hidden lg:block transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}></div>

      {/* Bottom Row: Navigation (Desktop) */}
      <div className="hidden lg:block py-3 bg-white relative">
        <div className="container mx-auto px-4">
          <ul className="flex flex-nowrap items-center justify-center gap-5 xl:gap-8 text-[13px] font-bold text-[#4A4A4A] tracking-wider relative whitespace-nowrap">
            {navItems.map((item) => (
              <li 
                key={item.name} 
                className="group relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-brand-accent transition-colors py-2"
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={14} className="mt-0.5 text-gray-400 group-hover:text-brand-accent transition-transform" />}
                </div>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.subItems && (
                  <div 
                    className={`absolute left-0 top-full pt-2 w-56 z-[100] transition-all duration-200 ease-in-out ${
                      activeDropdown === item.name 
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-white shadow-xl border-t-2 border-brand-accent rounded-b-sm flex flex-col py-2">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem} 
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.name, subItem);
                          }}
                          className="px-4 py-2 text-left text-[#4A4A4A] hover:text-brand-accent hover:bg-gray-50 transition-colors text-sm font-normal capitalize whitespace-normal w-full"
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider Line for Bottom of Nav (Only when not scrolled) */}
      <div className={`w-full h-[1px] bg-brand-accent opacity-50 hidden lg:block transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-50'}`}></div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-4 absolute w-full left-0 shadow-lg h-screen overflow-y-auto pb-24 top-full">
          <div className="mb-6 flex gap-2">
            <input 
              type="text" 
              placeholder="Search ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none bg-white"
            />
            <button onClick={handleSearchSubmit} className="bg-brand-accent px-3 py-2">
              <Search className="h-4 w-4 text-gray-800" />
            </button>
          </div>
          <ul className="flex flex-col space-y-0 divide-y divide-gray-100">
            {navItems.map(item => (
              <li key={item.name} className="flex flex-col py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                <div 
                  className="flex items-center justify-between w-full"
                  onClick={() => {
                    if (item.hasDropdown) {
                      setActiveDropdown(activeDropdown === item.name ? null : item.name);
                    } else {
                      handleNavClick(item.name);
                    }
                  }}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
                {/* Mobile Dropdown */}
                {item.hasDropdown && activeDropdown === item.name && item.subItems && (
                  <ul className="mt-2 pl-4 space-y-2 border-l-2 border-gray-200 ml-1">
                    {item.subItems.map(subItem => (
                      <li 
                        key={subItem} 
                        className="text-gray-500 font-medium capitalize text-xs py-1"
                        onClick={() => handleNavClick(item.name, subItem)}
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-3 text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer" onClick={handleUserIconClick}>
                {isAuthenticated ? 'My Profile' : 'Login / Signup'}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
