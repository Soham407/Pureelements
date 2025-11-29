import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      onLogin();
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-sm shadow-xl max-w-sm w-full text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-[#8B7E66]" />
        </div>
        <h2 className="font-serif text-2xl text-gray-800 mb-2">Admin Access</h2>
        <p className="text-gray-500 text-sm mb-6">Enter security PIN to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            placeholder="Enter PIN"
            className="w-full text-center text-2xl tracking-[0.5em] font-bold border-b-2 border-gray-200 focus:border-[#8B7E66] outline-none py-2"
            autoFocus
            maxLength={4}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 rounded-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#8B7E66] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#7A6D55] rounded-sm shadow-lg"
            >
              Access
            </button>
          </div>
        </form>
        <p className="mt-6 text-[10px] text-gray-400">Default PIN: 1234</p>
      </div>
    </div>
  );
};

export default AdminLogin;