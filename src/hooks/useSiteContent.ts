import { useState, useEffect, useCallback } from 'react';
import { NavItem, Slide, Category, ContentBlock, ConcernsContent, GiftingContent, BestsellersConfig, VideoContent, StoreContent, Testimonial } from '../types';
import { navItemsService, heroSlidesService, categoriesService, contentService } from '../lib/database';
import { CONCERNS, TESTIMONIALS, STORES } from '../constants'; // Fallback constants

interface UseSiteContentResult {
  navItems: NavItem[];
  heroSlides: Slide[];
  categories: Category[];
  
  // Dynamic Sections
  concerns: ConcernsContent[];
  gifting: GiftingContent[];
  bestsellersConfig: BestsellersConfig | null;
  videoSection: VideoContent | null;
  testimonials: Testimonial[];
  stores: StoreContent[];
  
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  updateNav: (navItems: NavItem[]) => Promise<NavItem[]>;
  updateHero: (slides: Slide[]) => Promise<Slide[]>;
  updateContentBlock: (sectionName: string, content: any) => Promise<void>;
}

export const useSiteContent = (): UseSiteContentResult => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Dynamic Content State
  const [concerns, setConcerns] = useState<ConcernsContent[]>(CONCERNS as any);
  const [gifting, setGifting] = useState<GiftingContent[]>([]);
  const [bestsellersConfig, setBestsellersConfig] = useState<BestsellersConfig | null>(null);
  const [videoSection, setVideoSection] = useState<VideoContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [stores, setStores] = useState<StoreContent[]>(STORES);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
       const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
       if (!supabaseUrl) {
         throw new Error('Supabase URL is missing');
       }

      const [navData, slidesData, catsData, contentBlocks] = await Promise.all([
        navItemsService.getAll(),
        heroSlidesService.getAll(),
        categoriesService.getAll(),
        contentService.getAllBlocks().catch(err => {
            console.warn("Failed to fetch content blocks, using defaults", err);
            return [];
        })
      ]);

      setNavItems(navData.length > 0 ? navData : []);
      setHeroSlides(slidesData.length > 0 ? slidesData : []);
      setCategories(catsData.length > 0 ? catsData : []);

      // Parse Content Blocks
      if (contentBlocks.length > 0) {
          const blocksMap = contentBlocks.reduce<Record<string, any>>((acc, block) => {
              acc[block.section_name] = block.content;
              return acc;
          }, {});

          if (blocksMap['shop_by_concerns']) setConcerns(blocksMap['shop_by_concerns']);
          if (blocksMap['gifting_collection']) setGifting(blocksMap['gifting_collection']);
          if (blocksMap['bestsellers_config']) setBestsellersConfig(blocksMap['bestsellers_config']);
          if (blocksMap['video_section']) setVideoSection(blocksMap['video_section']);
          if (blocksMap['testimonials']) setTestimonials(blocksMap['testimonials']);
          if (blocksMap['stores']) setStores(blocksMap['stores']);
      }

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

  const updateContentBlock = async (sectionName: string, content: any) => {
      await contentService.updateBlock(sectionName, content);
      await fetchData(); // Refresh all to be safe or update local state optimistically
  };

  return { 
      navItems, heroSlides, categories, 
      concerns, gifting, bestsellersConfig, videoSection, testimonials, stores,
      loading, error, refresh: fetchData, updateNav, updateHero, updateContentBlock 
  };
};
