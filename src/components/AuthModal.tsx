import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    signup, 
    authView, 
    setAuthView,
    isLoading 
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const modalRef = useFocusTrap(isAuthModalOpen, closeAuthModal);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (authView === 'LOGIN') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const switchView = (view: 'LOGIN' | 'SIGNUP') => {
    setAuthView(view);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      ></div>

      {/* Modal Content */}
      <div ref={modalRef} className="bg-white w-full max-w-md relative z-10 rounded-sm shadow-2xl overflow-hidden animate-fade-in-up">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${
              authView === 'LOGIN' 
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => switchView('LOGIN')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${
              authView === 'SIGNUP' 
                ? 'bg-white text-brand-primary border-b-2 border-brand-primary' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => switchView('SIGNUP')}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-gray-800 mb-2">
              {authView === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 font-light">
              {authView === 'LOGIN' 
                ? 'Enter your credentials to access your account' 
                : 'Join Pure Elements for exclusive offers & rewards'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {authView === 'SIGNUP' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-brand-primary focus:outline-none transition-colors rounded-sm text-sm bg-white"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-brand-primary focus:outline-none transition-colors rounded-sm text-sm bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Password</label>
                {authView === 'LOGIN' && (
                  <a href="#" className="text-xs text-brand-primary hover:underline">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-brand-primary focus:outline-none transition-colors rounded-sm text-sm bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-dark text-white py-4 uppercase font-bold tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg group"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {authView === 'LOGIN' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social / Divider */}
          <div className="mt-8 relative flex items-center justify-center">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
             </div>
             <span className="relative bg-white px-4 text-xs text-gray-400">OR CONTINUE WITH</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
             <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 text-sm hover:bg-gray-50 transition-colors rounded-sm">
                <span className="font-bold text-blue-600">G</span> Google
             </button>
             <button className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 text-sm hover:bg-gray-50 transition-colors rounded-sm">
                <span className="font-bold text-blue-800">f</span> Facebook
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;