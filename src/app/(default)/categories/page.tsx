
import { CategoryCard } from '@/components/categories/CategoryCard';
import { getCategories } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías de Productos - Noble',
  description: 'Explora todas las categorías de productos en Noble.',
};

// This is now a Server Component
export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary font-headline">Categorías de Productos</h1>
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">No hay categorías disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
