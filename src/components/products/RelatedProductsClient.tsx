
"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts, RelatedProductsInput, RelatedProductsOutput } from '@/ai/flows/related-products';
import { getProductsByIds } from '@/lib/data'; // Import the new data fetching function
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsClientProps {
  productId: string; // ID of the current product being viewed
  categoryName: string; // Name of the category of the current product
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
        const aiInput: RelatedProductsInput = {
          category: categoryName,
          productId: productId,
          numberOfProducts: 4, // Request 4 product IDs from AI
        };
        const aiOutput: RelatedProductsOutput = await getRelatedProducts(aiInput);
        
        // Extract product IDs, ensuring they are valid strings, not the current product, and not empty
        const relatedProductIds = aiOutput
          .map(p => p.productId)
          .filter(id => typeof id === 'string' && id.trim() !== '') // Ensure it's a non-empty string
          .filter(id => id !== productId) // Filter out the current product
          .slice(0, 4); // Ensure we only try to fetch up to 4

        if (relatedProductIds.length > 0) {
          // Fetch full product details from Supabase for these IDs
          const fetchedProducts = await getProductsByIds(relatedProductIds);
          setRelatedProducts(fetchedProducts);
        } else {
          setRelatedProducts([]);
        }

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

    if (productId && categoryName) {
      fetchRelated();
    }
  }, [productId, categoryName]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También Te Podría Gustar</h2>
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
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También Te Podría Gustar</h2>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    // Optionally, display a message or return null if no related products found
    // console.log("No related products to display.");
    return null; 
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También Te Podría Gustar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

