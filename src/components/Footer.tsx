import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Lock, Loader2, Send } from 'lucide-react';
import { newsletterService } from '../lib/database';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onNavigate: (category: string) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await newsletterService.subscribe(email);
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
    } catch (error: any) {
      showToast(error.message || 'Failed to subscribe', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
              <li><a onClick={() => onNavigate('PAYMENT')} className="hover:text-white transition-colors">Payment Policy</a></li>
              <li><a onClick={() => onNavigate('REFUND')} className="hover:text-white transition-colors">Refund & Returns</a></li>
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

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-bold">Stay Updated</h4>
            <p className="text-sm font-light text-gray-200 mb-4">Subscribe to our newsletter for exclusive offers and wellness tips.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-8">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-2 rounded-sm text-sm flex-1 focus:outline-none focus:border-white/50"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-white text-[#8B8B7A] px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-70"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>

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
            <div className="mt-4 md:mt-0 flex gap-4 items-center">
                 {/* Payment Icons Placeholder */}
                 <div className="flex gap-2">
                   <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">VISA</div>
                   <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">MasterCard</div>
                   <div className="bg-white px-2 py-1 rounded text-gray-800 font-bold text-xs">UPI</div>
                 </div>
                 
                 {/* Admin Login Link */}
                 {/* Admin Login Link - Only visible to admins */}
                 {/* Note: In a real app, you might want a hidden way to access admin login if not logged in, 
                     or just rely on the /admin route. For now, we show it only if isAdmin is true, 
                     OR if we want to allow login, we might keep it but maybe less visible?
                     User asked: "only then show the button". So we hide it if not admin.
                     BUT: If I am not logged in, how do I become admin?
                     I need to login first.
                     If I am logged in as user, and I am admin, I see the button.
                     If I am not logged in, I don't see the button? Then how do I login as admin?
                     The user said: "check if the user is an admin, and only then show the button".
                     This implies the user is ALREADY logged in.
                     If they are not logged in, they can't be verified as admin.
                     So we hide it.
                     To access admin login initially, they might need to go to /admin directly or login as user first.
                     Let's assume they login as user first.
                  */}
                 {/* Actually, if I am not logged in, I can't be checked. 
                     So I will hide it. To login as admin, one must login as user first?
                     Or maybe the /admin route handles the login.
                     But the button is "Admin".
                     Let's follow instruction: "only then show the button".
                 */}
                 {/* We need to import useAuth first */}
                 <AdminButton onNavigate={onNavigate} />
            </div>
        </div>
      </div>
    </footer>
  );
};

const AdminButton: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { isAdmin } = useAuth(); // We need to import useAuth in the file
  
  if (!isAdmin) return null;

  return (
    <button 
      onClick={() => onNavigate('ADMIN')}
      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors ml-4 border border-white/20 px-2 py-1 rounded-sm hover:bg-white/10"
      title="Admin Dashboard"
    >
      <Lock size={12} />
      <span className="text-[10px] font-bold uppercase">Admin</span>
    </button>
  );
};

export default Footer;
