
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types';
import { useAuth } from './AuthContext';
import { wishlistService } from './lib/database';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from Supabase when user is authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated || !user) {
        setWishlist([]);
        return;
      }

      setIsLoading(true);
      try {
        const wishlistData = await wishlistService.getWishlist(user.id);
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, isAuthenticated]);

  const addToWishlist = async (product: Product) => {
    if (!isAuthenticated || !user) {
      // For non-authenticated users, use localStorage as fallback
      setWishlist((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        return [...prev, product];
      });
      return;
    }

    try {
      await wishlistService.addToWishlist(user.id, product.id);
      setWishlist((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        return [...prev, product];
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!isAuthenticated || !user) {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    try {
      await wishlistService.removeFromWishlist(user.id, productId);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const toggleWishlist = async (product: Product) => {
    const isInList = wishlist.some((item) => item.id === product.id);
    if (isInList) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
