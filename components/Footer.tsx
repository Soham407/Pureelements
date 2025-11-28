
import React from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

interface Props {
  onNavigate: (category: string) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#8B8B7A] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Info */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-bold">Information</h4>
            <ul className="space-y-3 text-sm font-light text-gray-200 cursor-pointer">
              <li><a onClick={() => onNavigate('ABOUT US')} className="hover:text-white transition-colors">About Us</a></li>
              <li><a onClick={() => onNavigate('STORES')} className="hover:text-white transition-colors">Our Stores</a></li>
              <li><a onClick={() => onNavigate('BLOG')} className="hover:text-white transition-colors">Blog</a></li>
              <li><a onClick={() => onNavigate('CONTACT')} className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-bold">Support</h4>
            <ul className="space-y-3 text-sm font-light text-gray-200 cursor-pointer">
              <li><a onClick={() => onNavigate('PROFILE')} className="hover:text-white transition-colors">My Account</a></li>
              <li><a onClick={() => onNavigate('TERMS')} className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a onClick={() => onNavigate('PRIVACY')} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a onClick={() => onNavigate('SHIPPING')} className="hover:text-white transition-colors">Shipping & Delivery</a></li>
            </ul>
          </div>

          {/* Column 3: Office Address */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-bold">Office Address</h4>
            <div className="text-sm font-light text-gray-200 space-y-4">
              <div>
                <strong className="block text-white mb-1">Corporate Office</strong>
                <p>Shree Sanjeevan Wellness Solutions,<br/>Behind Aaimata Mandir,<br/>Bibwewadi, Pune - 37</p>
              </div>
              <div>
                <strong className="block text-white mb-1">Mahabaleshwar Office</strong>
                <p>Pure Elements Wellness Solutions,<br/>Main Market, Mahabaleshwar</p>
              </div>
            </div>
          </div>

           {/* Column 4: Contact & Social */}
           <div>
            <h4 className="font-serif text-xl mb-6 font-bold">Contact Info</h4>
            <div className="space-y-4 text-sm font-light text-gray-200">
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Customer Support:</p>
                  <p>+91 9021099099</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Email:</p>
                  <p>customercare@pureelements.in</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
                <h5 className="font-bold text-white mb-4">Follow us</h5>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><Facebook size={20} /></a>
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><Youtube size={20} /></a>
                </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-300">
            <p>© 2024 Pure Elements. All Rights Reserved.</p>
            <div className="mt-4 md:mt-0 flex gap-2">
                 {/* Payment Icons Placeholder */}
                 <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">VISA</div>
                 <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">MasterCard</div>
                 <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">UPI</div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
