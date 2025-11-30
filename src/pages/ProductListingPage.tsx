import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProductListing from '../components/ProductListing';
import { NavItem, Product } from '../types';

interface ProductListingPageProps {
  allProducts: Product[];
  navItems: NavItem[];
  onProductClick: (product: Product) => void;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ 
  allProducts, 
  navItems, 
  onProductClick 
}) => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subCategory = searchParams.get('subCategory') || undefined;
  const searchQuery = searchParams.get('q') || undefined;

  const handleNavigate = (cat: string, subCat?: string) => {
    if (cat === 'HOME') {
      navigate('/');
      window.scrollTo(0, 0);
      return;
    }
    if (subCat) {
      navigate(`/shop/${cat}?subCategory=${subCat}`);
    } else {
      navigate(`/shop/${cat}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <ProductListing
      products={allProducts}
      navItems={navItems}
      initialCategory={category || 'SKIN CARE'}
      initialSubCategory={subCategory}
      initialSearchQuery={searchQuery}
      onNavigate={handleNavigate}
      onProductClick={onProductClick}
    />
  );
};

export default ProductListingPage;

