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

const mapAiProductToProductCard = (aiProduct: RelatedProductsOutput[0]): Product => ({
  id: aiProduct.productId,
  name: aiProduct.name,
  description: aiProduct.description,
  images: [aiProduct.imageUrl || 'https://placehold.co/600x800.png'],
  price: 0, 
  colors: [], 
  category: '', 
  productCode: '', 
  slug: aiProduct.productId, 
  stock: 1, 
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
        
        const filteredOutput = aiOutput.filter(p => p.productId !== productId);
        setRelatedProducts(filteredOutput.map(mapAiProductToProductCard));

      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
        setError('Error al cargar productos relacionados.');
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
