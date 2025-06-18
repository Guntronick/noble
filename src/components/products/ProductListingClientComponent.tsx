
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

interface ProductListingClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialCategorySlugFromSearch?: string;
}

export default function ProductListingClientComponent({
  initialProducts,
  initialCategories,
  initialCategorySlugFromSearch,
}: ProductListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // To read other potential search params

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize selectedCategory with the slug from server, or 'all'
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlugFromSearch || 'all');

  // Update selectedCategory if the initialCategorySlugFromSearch prop changes (e.g., direct navigation)
  useEffect(() => {
    setSelectedCategory(initialCategorySlugFromSearch || 'all');
    setCurrentPage(1); // Reset page when category changes via prop
  }, [initialCategorySlugFromSearch]);


  const filteredProducts = useMemo(() => {
    let productsToFilter: Product[] = initialProducts;

    // Category filtering is now primarily handled by the server for initial load.
    // This client-side filter will act on the `initialProducts` if the `selectedCategory`
    // is changed via the dropdown AFTER the initial load.
    // For a full server-side filtering experience on dropdown change, we'd need to navigate.
    if (selectedCategory !== 'all') {
      const categoryObj = initialCategories.find(c => c.slug === selectedCategory);
      if (categoryObj) {
        // This filters based on the `product.category` which should be the category NAME
        productsToFilter = productsToFilter.filter(p => p.category === categoryObj.name);
      }
    }
    
    if (searchTerm) {
      productsToFilter = productsToFilter.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return productsToFilter;
  }, [selectedCategory, searchTerm, initialProducts, initialCategories]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    // For full server-side filtering on category change, navigate:
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (slug === 'all') {
      current.delete('category');
    } else {
      current.set('category', slug);
    }
    const query = current.toString();
    router.push(`/products${query ? `?${query}` : ''}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };
  
  const pageTitle = selectedCategory === 'all' 
    ? 'Todos los Productos' 
    : initialCategories.find(c => c.slug === selectedCategory)?.name || 'Productos';

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 text-primary font-headline">{pageTitle}</h1>
      <p className="text-lg text-muted-foreground text-center mb-10">
        Explora nuestra colección de mercancía inspirada en IA y tecnología de vanguardia.
      </p>

      <div className="mb-8 p-4 bg-muted/50 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Buscar Productos</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-1">Filtrar por Categoría</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                {initialCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <label htmlFor="items-per-page" className="block text-sm font-medium text-foreground mb-1">Artículos por Página</label>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger id="items-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl text-muted-foreground">No se encontraron productos.</p>
          {(searchTerm || selectedCategory !== 'all') && <p className="mt-2">Intenta ajustar tu búsqueda o filtros, o selecciona "Todas las Categorías".</p>}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
