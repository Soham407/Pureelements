import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useCart } from '../CartContext';

interface NavbarProps {
  onNavigate: (category: string, subCategory?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const controlNavbar = () => {
      // Don't hide navbar if mobile menu is open
      if (isOpen) return;

      const currentScrollY = window.scrollY;

      // Logic: Hide if scrolling down more than 100px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, isOpen]);

  const handleNavClick = (name: string, subItem?: string) => {
    onNavigate(name, subItem);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav 
      className={`bg-white sticky top-0 z-50 shadow-sm font-sans w-full transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Row: Search, Logo, Actions */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          
          {/* Left: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center w-full md:w-1/3">
            <div className="flex w-full max-w-[280px]">
              <input 
                type="text" 
                placeholder="Search ..." 
                className="w-full border border-gray-200 border-r-0 px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-300 rounded-l-sm"
              />
              <button className="bg-[#F2C94C] px-4 py-2 flex items-center justify-center hover:bg-[#E0B83E] transition-colors rounded-r-sm">
                <Search className="h-5 w-5 text-gray-800" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Center: Logo (Mobile & Desktop) */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-center md:flex-grow">
            <button className="md:hidden p-2 -ml-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center justify-center gap-3 cursor-pointer" onClick={() => handleNavClick('HOME')}>
              {/* Logo Icon Placeholder */}
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-[3px] border-gray-500 p-0.5 flex-shrink-0 flex items-center justify-center">
                 <div className="w-full h-full rounded-full bg-[#F5A623] border-[2px] border-white"></div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col items-start">
                <h1 className="text-xl md:text-3xl font-sans text-[#4A4A4A] uppercase tracking-wide leading-none" style={{ fontWeight: 400 }}>
                  PURE ELEMENTS
                  <sup className="text-[8px] md:text-[10px] top-[-0.5em] ml-0.5 text-gray-400">TM</sup>
                </h1>
                <span className="text-[8px] md:text-[11px] tracking-[0.35em] text-black uppercase font-medium mt-1 w-full text-justify">
                  PROMISE OF AYURVEDA
                </span>
              </div>
            </div>

            {/* Mobile Cart Icon */}
            <div className="md:hidden relative mr-1" onClick={openCart}>
              <ShoppingCart className="h-6 w-6 text-[#3A5A40]" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3A5A40] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </div>
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center justify-end w-full md:w-1/3 gap-6">
            <div className="relative group cursor-pointer" onClick={openCart}>
              <ShoppingCart className="h-7 w-7 text-[#3A5A40]" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#3A5A40] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            </div>
            <div className="cursor-pointer hover:opacity-70">
              <User className="h-7 w-7 text-gray-500" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full h-[1px] bg-[#F2C94C] hidden md:block"></div>

      {/* Bottom Row: Navigation (Desktop) */}
      <div className="hidden md:block py-3 bg-white relative">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-between lg:justify-center lg:gap-8 xl:gap-10 text-[13px] font-bold text-[#4A4A4A] tracking-wider relative">
            {NAV_ITEMS.map((item) => (
              <li 
                key={item.name} 
                className="group relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#F5A623] transition-colors whitespace-nowrap py-2"
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={14} className="mt-0.5 text-gray-400 group-hover:text-[#F5A623]" />}
                </div>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.subItems && (
                  <div className={`absolute left-0 top-full pt-1 w-56 z-50 transition-all duration-200 ${
                    activeDropdown === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    <div className="bg-white shadow-lg border-t-2 border-[#F5A623] flex flex-col py-2">
                      {item.subItems.map((subItem) => (
                        <a 
                          key={subItem} 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.name, subItem);
                          }}
                          className="px-4 py-2 text-left text-[#4A4A4A] hover:text-[#F5A623] hover:bg-gray-50 transition-colors text-sm font-normal capitalize"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider Line for Bottom of Nav */}
      <div className="w-full h-[1px] bg-[#F2C94C] opacity-50 hidden md:block"></div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full left-0 shadow-lg h-screen overflow-y-auto pb-24 top-full">
          <div className="mb-6 flex">
            <input 
              type="text" 
              placeholder="Search ..." 
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
            />
            <button className="bg-[#F2C94C] px-3 py-2">
              <Search className="h-4 w-4 text-gray-800" />
            </button>
          </div>
          <ul className="flex flex-col space-y-0 divide-y divide-gray-100">
            {NAV_ITEMS.map(item => (
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
            <li className="py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">My Account</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;