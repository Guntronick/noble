
import type { Product, Category } from './types';
import { supabase } from './supabaseClient';

// Helper function to map Supabase product (snake_case, with joined category) to our Product type (camelCase)
function mapSupabaseProductToAppProduct(supabaseProduct: any): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    images: supabaseProduct.images || [], // Ensure images is an array
    price: supabaseProduct.price,
    colors: supabaseProduct.colors || [], // Ensure colors is an array
    category: supabaseProduct.categories?.name || 'Uncategorized', // Joined category name
    productCode: supabaseProduct.product_code,
    slug: supabaseProduct.slug,
    stock: supabaseProduct.stock,
    dataAiHint: supabaseProduct.data_ai_hint,
  };
}

// Helper function to map Supabase category to our Category type
function mapSupabaseCategoryToAppCategory(supabaseCategory: any): Category {
  return {
    id: supabaseCategory.id,
    name: supabaseCategory.name,
    slug: supabaseCategory.slug,
    imageUrl: supabaseCategory.image_url || 'https://placehold.co/400x400.png',
    dataAiHint: supabaseCategory.data_ai_hint,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data ? data.map(mapSupabaseCategoryToAppCategory) : [];
}

export async function getProducts(options?: { categorySlug?: string; limit?: number }): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)') // Join with categories table to get name and slug
    .order('created_at', { ascending: false });

  if (options?.categorySlug) {
    // To filter by category slug, we first need the category_id
    // This assumes 'categories' table has unique 'slug'
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .single();

    if (categoryError || !categoryData) {
      console.error('Error fetching category for slug:', options.categorySlug, categoryError);
      return [];
    }
    query = query.eq('category_id', categoryData.id);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data ? data.map(mapSupabaseProductToAppProduct) : [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
  return data ? mapSupabaseProductToAppProduct(data) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching product by id ${id}:`, error);
    return null;
  }
  return data ? mapSupabaseProductToAppProduct(data) : null;
}

// This function is for the RelatedProductsClient which expects an array of AI products.
// It will now fetch actual products from Supabase based on AI-generated product IDs.
export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .in('id', productIds);

  if (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }
  return data ? data.map(mapSupabaseProductToAppProduct) : [];
}

// The old static data (products and categories arrays) should be removed from here.
// And the old getProductsByCategory, getProductBySlug, getProductById functions.
// The new functions above replace them.
