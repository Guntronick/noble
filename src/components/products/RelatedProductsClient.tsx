
"use client";

import { useEffect, useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts, getProductsByIds, getProducts } from '@/lib/data';
import { getPersonalizedRecommendations, type RecommendationRequest } from '@/ai/flows/recommend-products-flow';
import { Skeleton } from '@/components/ui/skeleton';

const LOCAL_STORAGE_VIEWED_PRODUCTS_KEY = 'nobleViewedProducts';

interface RelatedProductsClientProps {
  productId: string; 
  categoryName: string; 
}

export function RelatedProductsClient({ productId, categoryName }: RelatedProductsClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      setError(null);
      try {
        let finalProducts: Product[] = [];
        let personalizedProducts: Product[] = [];
        
        // 1. Get personalized recommendations based on localStorage history
        const viewedProductIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VIEWED_PRODUCTS_KEY) || '[]') as string[];
        if (viewedProductIds.length > 1) {
            const viewedProducts = await getProductsByIds(viewedProductIds);
            if(viewedProducts.length > 0) {
              const recommendationRequest: RecommendationRequest = {
                  viewedProducts: viewedProducts.map(p => ({
                      name: p.name,
                      description: p.description,
                      category: p.category
                  }))
              };
              const recommendations = await getPersonalizedRecommendations(recommendationRequest);
              
              if(recommendations.recommendedCategorySlugs.length > 0) {
                 const recommendedProductsPromises = recommendations.recommendedCategorySlugs.map(slug => getProducts({ categorySlug: slug, limit: 2 }));
                 const productsByCat = await Promise.all(recommendedProductsPromises);
                 personalizedProducts = productsByCat.flat();
              }
            }
        }
        
        // 2. Get standard related products from the same category
        const sameCategoryProducts = await getRelatedProducts(categoryName, productId, 4);

        // 3. Combine and de-duplicate
        const combined = [...personalizedProducts, ...sameCategoryProducts];
        const uniqueProductIds = new Set<string>();
        finalProducts = combined
          .filter(p => p.id !== productId) // Ensure current product is not shown
          .filter(p => {
            if (uniqueProductIds.has(p.id)) {
              return false;
            }
            uniqueProductIds.add(p.id);
            return true;
          });

        setRelatedProducts(finalProducts.slice(0, 4)); // Limit to 4
        
      } catch (err) {
        let errorMessage = 'Error al cargar productos relacionados.';
        if (err instanceof Error) {
          errorMessage = `${errorMessage} ${err.message}`;
        }
        console.error('Error al cargar productos relacionados:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
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
    return null;
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
