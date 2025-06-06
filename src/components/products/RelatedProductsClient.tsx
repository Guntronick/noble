"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts, RelatedProductsInput, RelatedProductsOutput } from '@/ai/flows/related-products';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsClientProps {
  productId: string;
  categoryName: string;
}

// Helper to map AI output to Product type, if needed, or use AI output type directly
// For now, assuming AI output matches simplified ProductCard needs or we adapt
const mapAiProductToProductCard = (aiProduct: RelatedProductsOutput[0]): Product => ({
  id: aiProduct.productId,
  name: aiProduct.name,
  description: aiProduct.description,
  images: [aiProduct.imageUrl || 'https://placehold.co/600x800.png'], // Placeholder if no image
  price: 0, // Price not in AI output, might need to fetch or omit
  colors: [], // Not in AI output
  category: '', // Not in AI output
  productCode: '', // Not in AI output
  slug: aiProduct.productId, // Use productId as slug for linking if no specific slug
  stock: 1, // Assume in stock
  dataAiHint: aiProduct.name.toLowerCase().split(' ').slice(0,2).join(' '),
});


export function RelatedProductsClient({ productId, categoryName }: RelatedProductsClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      setError(null);
      try {
        const input: RelatedProductsInput = {
          category: categoryName,
          productId: productId,
          numberOfProducts: 4,
        };
        const aiOutput = await getRelatedProducts(input);
        
        // Filter out the current product if it appears in recommendations
        const filteredOutput = aiOutput.filter(p => p.productId !== productId);
        setRelatedProducts(filteredOutput.map(mapAiProductToProductCard));

      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products.');
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
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">You Might Also Like</h2>
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
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">You Might Also Like</h2>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Or a message like "No related products found"
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 text-primary font-headline">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
