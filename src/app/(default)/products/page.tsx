
import { getProducts, getCategories } from '@/lib/data';
import ProductListingClientComponent from '@/components/products/ProductListingClientComponent';
import type { Metadata } from 'next';

interface ProductListingServerPageProps {
  searchParams?: {
    category?: string;
  };
}

export async function generateMetadata({ searchParams }: ProductListingServerPageProps): Promise<Metadata> {
  const categorySlug = searchParams?.category;
  let pageTitle = 'Catálogo de Productos - Noble';
  
  if (categorySlug) {
    const formattedCategoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ');
    pageTitle = `${formattedCategoryName} - Catálogo - Noble`;
  }
  
  return {
    title: pageTitle,
    description: 'Explora nuestra colección de mercancía inspirada en IA y tecnología de vanguardia.',
  };
}

// This is the Server Component
export default async function ProductListingServerPage({ searchParams }: ProductListingServerPageProps) {
  const categorySlug = searchParams?.category;
  
  const [initialProducts, categories] = await Promise.all([
    getProducts({ categorySlug }),
    getCategories()
  ]);

  return (
    <ProductListingClientComponent
      initialProducts={initialProducts}
      categories={categories}
      initialCategory={categorySlug}
    />
  );
}
