
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // "Ver Productos" button will use primary style (Azul Petróleo) and hover to Naranja
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl">
      <Image
        src={category.imageUrl}
        alt={category.name}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-105"
        data-ai-hint={category.dataAiHint}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4 font-headline">{category.name}</h3>
        <Button asChild variant="default" className="hover:bg-cta-orange hover:text-cta-orange-foreground">
          <Link href={`/products?category=${category.slug}`}>Ver Productos</Link>
        </Button>
      </div>
    </div>
  );
}
