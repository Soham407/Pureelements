import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import SEO from '../components/SEO';
import { ProductDetailsSkeleton } from '../components/SkeletonLoader';
import { Product } from '../types';
import { productsService } from '../lib/database';

interface ProductDetailsPageProps {
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  allProducts, 
  onProductClick 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productId = parseInt(id);
        // First try to find in allProducts
        const foundProduct = allProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setLoading(false);
          return;
        }

        // If not found, fetch from database
        const fetchedProduct = await productsService.getById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, allProducts, navigate]);

  const handleNavigate = (category: string, subCategory?: string) => {
    if (category === 'HOME') {
      navigate('/');
    } else if (subCategory) {
      navigate(`/shop/${category}?subCategory=${subCategory}`);
    } else {
      navigate(`/shop/${category}`);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <SEO 
        title={product.name} 
        description={product.description} 
        image={product.image}
      />
      <ProductDetails
        product={product}
        allProducts={allProducts}
        onNavigate={handleNavigate}
        onProductClick={onProductClick}
      />
    </>
  );
};

export default ProductDetailsPage;

