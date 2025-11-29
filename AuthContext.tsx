
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: supabaseUser.id,
      name: profile.name,
      email: supabaseUser.email || '',
      phone: profile.phone || undefined,
      joinedDate: new Date(profile.created_at).toLocaleDateString()
    };
  };

  // Check session on mount and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user).then(setUser);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Update profile with name (trigger should create profile, but update name just in case)
        await supabase
          .from('user_profiles')
          .update({ name })
          .eq('id', data.user.id);

        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.reload(); // Simple reload to clear view state
    } catch (error: any) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
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
