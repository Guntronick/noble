"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

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
      if (!productId || !categoryName) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const products = await getRelatedProducts(categoryName, productId, 4);
        setRelatedProducts(products);
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
    // We don't show the section if there are no related products to avoid showing an empty state.
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
