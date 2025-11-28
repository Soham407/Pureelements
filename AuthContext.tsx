
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authView: 'LOGIN' | 'SIGNUP';
  setAuthView: (view: 'LOGIN' | 'SIGNUP') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pure_elements_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (email && password) {
          const mockUser: User = {
            id: 'u_123',
            name: 'Ananya Sharma', // Mock name
            email: email,
            phone: '+91 98765 43210',
            joinedDate: new Date().toLocaleDateString()
          };
          setUser(mockUser);
          localStorage.setItem('pure_elements_user', JSON.stringify(mockUser));
          setIsAuthModalOpen(false);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1500);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        const newUser: User = {
          id: `u_${Math.random().toString(36).substr(2, 9)}`,
          name: name,
          email: email,
          joinedDate: new Date().toLocaleDateString()
        };
        setUser(newUser);
        localStorage.setItem('pure_elements_user', JSON.stringify(newUser));
        setIsAuthModalOpen(false);
        resolve();
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pure_elements_user');
    window.location.reload(); // Simple reload to clear view state
  };

  const openAuthModal = () => {
    setAuthView('LOGIN');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      authView,
      setAuthView
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
