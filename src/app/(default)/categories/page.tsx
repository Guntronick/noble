
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías - Noble',
  description: 'Categorías de productos.',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary font-headline">Categorías</h1>
      <p className="text-center text-muted-foreground">La sección de categorías se encuentra temporalmente deshabilitada.</p>
    </div>
  );
}
