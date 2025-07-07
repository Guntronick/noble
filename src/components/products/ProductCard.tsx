
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayImage = product.images.default && product.images.default.length > 0 
    ? product.images.default[0] 
    : 'https://placehold.co/300x400.png';

  return (
    <Card className="overflow-hidden bg-card text-card-foreground shadow-lg dark:border dark:border-border dark:hover:border-primary hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full group">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.slug}`} className="block aspect-[3/4] relative">
          <Image
            src={displayImage}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 font-headline">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-price">${product.price.toFixed(2)}</p>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/products/${product.slug}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
