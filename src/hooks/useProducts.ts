import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { productsService } from '../lib/database';

interface UseProductsResult {
  products: Product[];
  bestsellers: Product[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  updateProduct: (product: Product) => Promise<Product>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
}

export const useProducts = (enabled: boolean = true): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL is missing. Please configure VITE_SUPABASE_URL in .env');
      }

      // Fetch all products (pagination can be added later if needed)
      const { products: allProducts } = await productsService.getAll(1, 1000);
      setProducts(allProducts);

      // Fetch bestsellers
      const bestsellersData = await productsService.getBestsellers(5);
      setBestsellers(bestsellersData);

    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, enabled]);

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const updated = await productsService.update(updatedProduct.id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updated : p));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const created = await productsService.create(newProduct);
      setProducts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      throw err;
    }
  };

  return { products, bestsellers, loading, error, refresh: fetchData, updateProduct, addProduct };
};
