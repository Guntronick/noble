
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
  const ctaButtonClass = "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground";
  return (
    <Card className="overflow-hidden bg-card text-card-foreground shadow-lg hover:shadow-[0_4px_15px_rgba(31,59,77,0.2)] transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block aspect-[3/4] relative">
          <Image
            src={product.images[0]}
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
          <p className="text-xl font-semibold text-accent">${product.price.toFixed(2)}</p> {/* Dorado Suave */}
          <Badge variant="secondary">{product.category}</Badge> {/* Verde Salvia */}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className={cn("w-full", ctaButtonClass)}>
          <Link href={`/products/${product.slug}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
