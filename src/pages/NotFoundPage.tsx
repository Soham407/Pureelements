import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFFBF2] px-4 text-center">
      <SEO title="Page Not Found" />
      
      <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 bg-[#8B7E66] text-white px-8 py-3 uppercase font-bold tracking-widest text-xs hover:bg-[#5D6D55] transition-colors w-full"
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
