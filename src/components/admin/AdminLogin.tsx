import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (user) {
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized: You do not have admin access.');
        }

        onLogin();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-sm shadow-xl max-w-sm w-full text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-[#8B7E66]" />
        </div>
        <h2 className="font-serif text-2xl text-gray-800 mb-2">Admin Access</h2>
        <p className="text-gray-500 text-sm mb-6">Sign in with your admin credentials</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full border border-gray-200 p-3 pl-10 rounded-sm focus:border-[#8B7E66] outline-none"
                required
              />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 p-3 pl-10 rounded-sm focus:border-[#8B7E66] outline-none"
                required
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 rounded-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#8B7E66] text-white py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#7A6D55] rounded-sm shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;