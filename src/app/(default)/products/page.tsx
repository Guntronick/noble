
import { getProducts, getCategories } from '@/lib/data';
import ProductListingClientComponent from '@/components/products/ProductListingClientComponent';
import type { Metadata } from 'next';

// Optional: Generate metadata dynamically based on fetched data if needed
export async function generateMetadata(): Promise<Metadata> {
  // You could fetch categories here if you want to make the title dynamic
  // For now, using a generic title
  return {
    title: 'Catálogo de Productos - Noble',
    description: 'Explora nuestra colección de mercancía inspirada en IA y tecnología de vanguardia.',
  };
}

// This is the Server Component
export default async function ProductListingServerPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialCategorySlug = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  
  // Fetch initial data on the server
  // Pass categorySlug to getProducts if present, otherwise it fetches all products
  const initialProducts = await getProducts(initialCategorySlug ? { categorySlug: initialCategorySlug } : {});
  const allCategories = await getCategories();

  return (
    <ProductListingClientComponent
      initialProducts={initialProducts}
      initialCategories={allCategories}
      initialCategorySlugFromSearch={initialCategorySlug} // Pass the slug from URL search params
    />
  );
}

