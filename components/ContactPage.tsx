
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useToast } from '../ToastContext';

const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      showToast('Message sent successfully!', 'success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-[#FFFBF2] py-16 mb-10">
         <div className="container mx-auto px-4">
             <SectionHeader title="Contact Us" subtitle="Get in Touch" />
         </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Contact Info */}
          <div className="w-full md:w-1/3 space-y-8 animate-fade-in">
             <div className="bg-[#FFFBF2] p-8 rounded-sm border border-[#8B7E66]/20 h-full">
                <h3 className="font-serif text-xl text-gray-800 mb-6">Reach Us At</h3>
                
                <div className="space-y-8">
                   <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm text-[#8B7E66]">
                         <Phone size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm uppercase tracking-wide">Phone</p>
                         <p className="text-gray-600 mt-1">+91 9021099099</p>
                         <p className="text-gray-400 text-xs mt-1">Mon-Sat, 9am - 6pm</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm text-[#8B7E66]">
                         <Mail size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm uppercase tracking-wide">Email</p>
                         <p className="text-gray-600 mt-1">customercare@pureelements.in</p>
                         <p className="text-gray-400 text-xs mt-1">For support & inquiries</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm text-[#8B7E66]">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-800 text-sm uppercase tracking-wide">Head Office</p>
                         <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                            Shree Sanjeevan Wellness Solutions,<br/>
                            Behind Aaimata Mandir,<br/>
                            Bibwewadi, Pune - 411037
                         </p>
                         <a href="#" className="text-[#8B7E66] text-xs font-bold underline mt-2 inline-block">View on Google Maps</a>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-2/3 animate-fade-in">
             <h3 className="font-serif text-2xl text-gray-800 mb-6">Send us a Message</h3>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none transition-colors bg-white"
                        placeholder="John Doe"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none transition-colors bg-white"
                        placeholder="john@example.com"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                   <textarea 
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none transition-colors resize-none bg-white"
                      placeholder="How can we help you?"
                   ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-[#2C2C2C] text-white px-8 py-3.5 uppercase font-bold tracking-widest text-xs hover:bg-black transition-all flex items-center gap-2"
                >
                   Send Message <Send size={16} />
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;