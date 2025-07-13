
"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts, getProductsByIds, getProducts } from '@/app/actions';
import { getPersonalizedRecommendations, type RecommendationRequest } from '@/ai/flows/recommend-products-flow';
import { Skeleton } from '@/components/ui/skeleton';

const LOCAL_STORAGE_VIEWED_PRODUCTS_KEY = 'nobleViewedProducts';

interface RelatedProductsClientProps {
  productId: string; 
  categoryName: string; 
}

// Fetches personalized products based on user's viewing history
async function fetchPersonalizedProducts(currentProductId: string): Promise<Product[]> {
  if (typeof window === 'undefined') return [];
  
  const viewedProductIdsJSON = localStorage.getItem(LOCAL_STORAGE_VIEWED_PRODUCTS_KEY);
  const viewedProductIds = viewedProductIdsJSON ? (JSON.parse(viewedProductIdsJSON) as string[]) : [];

  if (viewedProductIds.length < 2) return [];

  try {
    const viewedProducts = await getProductsByIds(viewedProductIds);
    if (viewedProducts.length < 2) return [];

    const recommendationRequest: RecommendationRequest = {
      viewedProducts: viewedProducts.map(p => ({
        name: p.name,
        description: p.description,
        category: p.category,
      })),
    };
    
    const recommendations = await getPersonalizedRecommendations(recommendationRequest);
    if (recommendations.recommendedCategorySlugs.length === 0) return [];

    const recommendedProductsPromises = recommendations.recommendedCategorySlugs.map(slug =>
      getProducts({ categorySlug: slug, limit: 2 })
    );

    const productsByCat = await Promise.all(recommendedProductsPromises);
    const flatProducts = productsByCat.flat();
    
    // Filter out the current product from AI recommendations
    return flatProducts.filter(p => p.id !== currentProductId);
  } catch (error) {
    console.error("Failed to fetch personalized products:", error);
    return [];
  }
}


export function RelatedProductsClient({ productId, categoryName }: RelatedProductsClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllRelatedProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both standard related and AI-powered personalized products concurrently
        const [sameCategoryProducts, personalized] = await Promise.all([
            getRelatedProducts(categoryName, productId, 4),
            fetchPersonalizedProducts(productId)
        ]);

        // Combine and de-duplicate, giving priority to personalized items
        const combined = [...personalized, ...sameCategoryProducts];
        const uniqueProductIds = new Set<string>();
        
        const finalProducts = combined.filter(p => {
          if (uniqueProductIds.has(p.id)) {
            return false;
          }
          uniqueProductIds.add(p.id);
          return true;
        }).slice(0, 4); // Ensure we only show a maximum of 4 products

        setRelatedProducts(finalProducts);

      } catch (err) {
        console.error('Error loading related products:', err);
        setError('No se pudieron cargar los productos relacionados.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllRelatedProducts();
  }, [productId, categoryName]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't render the section if there are no products to show
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
