import { useState, useEffect, useCallback } from 'react';
import { NavItem, Slide, Category } from '../types';
import { navItemsService, heroSlidesService, categoriesService } from '../lib/database';
// import { NAV_ITEMS, INITIAL_SLIDES, CATEGORIES } from '../constants'; // Removed constants

interface UseSiteContentResult {
  navItems: NavItem[];
  heroSlides: Slide[];
  categories: Category[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  updateNav: (navItems: NavItem[]) => Promise<NavItem[]>;
  updateHero: (slides: Slide[]) => Promise<Slide[]>;
}

export const useSiteContent = (): UseSiteContentResult => {
  // Initialize with empty arrays to avoid flash of content if we want strict loading state
  // Or initialize with constants if we want optimistic UI (but goal is to remove constants)
  // Let's start empty and rely on loading state
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
       const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
       if (!supabaseUrl) {
         throw new Error('Supabase URL is missing');
       }

      const [navData, slidesData, catsData] = await Promise.all([
        navItemsService.getAll(),
        heroSlidesService.getAll(),
        categoriesService.getAll()
      ]);

      setNavItems(navData.length > 0 ? navData : []);
      setHeroSlides(slidesData.length > 0 ? slidesData : []);
      setCategories(catsData.length > 0 ? catsData : []);

    } catch (err: any) {
      console.error('Error fetching site content:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Failed to fetch site content'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateNav = async (updatedNavItems: NavItem[]) => {
    try {
      const updated = await navItemsService.updateAll(updatedNavItems);
      setNavItems(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updateHero = async (updatedSlides: Slide[]) => {
    try {
      const updated = await heroSlidesService.updateAll(updatedSlides);
      setHeroSlides(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return { navItems, heroSlides, categories, loading, error, refresh: fetchData, updateNav, updateHero };
};
