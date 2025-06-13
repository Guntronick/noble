import { CategoryCard } from '@/components/categories/CategoryCard';
import { categories } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías de Productos - Noble',
  description: 'Explora todas las categorías de productos en Noble.',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary font-headline">Categorías de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
