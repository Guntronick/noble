import { getCategories } from '@/lib/data';
import { CategoryCard } from '@/components/categories/CategoryCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías - Noble',
  description: 'Explora todas nuestras categorías de productos.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary font-headline">Categorías de Productos</h1>
        <p className="text-lg text-muted-foreground mt-2">Encuentra exactamente lo que buscas navegando por nuestras colecciones.</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <p className="text-xl text-muted-foreground">No se encontraron categorías.</p>
          <p className="text-sm text-muted-foreground mt-2">Por favor, verifica la conexión con la base de datos o si existen categorías creadas.</p>
        </div>
      )}
    </div>
  );
}
