import type { Product, Category, ProductImageStructure } from './types';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Key is missing from environment variables.');
}

// Initialize a separate client with the service_role key for server-side data fetching
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);


const SUPABASE_STORAGE_URL = supabaseUrl;

// Helper function to construct the full image URL from a path
function constructImageUrl(imagePath: string): string {
  if (!imagePath || imagePath.startsWith('http')) {
    return imagePath || 'https://placehold.co/600x500.png';
  }
   // Assuming 'products' is your public bucket name
  return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/products/${imagePath}`;
}

// Helper function to map Supabase product (snake_case, with joined category) to our Product type (camelCase)
function mapSupabaseProductToAppProduct(supabaseProduct: any): Product {
  let imagesData: ProductImageStructure = { default: [] };

  if (supabaseProduct.images && typeof supabaseProduct.images === 'object' && supabaseProduct.images !== null) {
    // Populate default images
    if (Array.isArray(supabaseProduct.images.default) && supabaseProduct.images.default.every((img: any) => typeof img === 'string')) {
      imagesData.default = supabaseProduct.images.default.map(constructImageUrl);
    }

    // Populate color-specific images
    for (const color in supabaseProduct.images) {
      if (color !== 'default' && Array.isArray(supabaseProduct.images[color]) && supabaseProduct.images[color].every((img: any) => typeof img === 'string') && supabaseProduct.images[color].length > 0) {
        imagesData[color] = supabaseProduct.images[color].map(constructImageUrl);
      }
    }
  } else if (Array.isArray(supabaseProduct.images) && supabaseProduct.images.every((img: any) => typeof img === 'string')) {
     imagesData.default = supabaseProduct.images.map(constructImageUrl);
  }

  // Fallback if no images are found
  if (!imagesData.default || imagesData.default.length === 0) {
    imagesData.default = ['https://placehold.co/600x500.png'];
  }


  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    images: imagesData, 
    price: supabaseProduct.price,
    colors: supabaseProduct.colors || [],
    category: supabaseProduct.categories?.name || 'Uncategorized',
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
    imageUrl: constructImageUrl(supabaseCategory.image_url) || 'https://placehold.co/400x400.png',
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
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (options?.categorySlug) {
        const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', options.categorySlug)
            .single();

        if (category) {
            query = query.eq('category_id', category.id);
        } else {
            // If a slug is provided but not found, return no products.
            return [];
        }
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products. Supabase error:', error);
        return [];
    }
    return data ? data.map(mapSupabaseProductToAppProduct) : [];
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching product by slug ${slug}. Supabase error:`, error);
     if (typeof error === 'object' && error !== null) {
      console.error('Error message:', (error as any).message);
      console.error('Error details:', (error as any).details);
      console.error('Error code:', (error as any).code);
      console.error('Full error object (stringified):', JSON.stringify(error, null, 2));
    }
    return null;
  }
  return data ? mapSupabaseProductToAppProduct(data) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching product by id ${id}. Supabase error:`, error);
    if (typeof error === 'object' && error !== null) {
      console.error('Error message:', (error as any).message);
      console.error('Error details:', (error as any).details);
      console.error('Error code:', (error as any).code);
      console.error('Full error object (stringified):', JSON.stringify(error, null, 2));
    }
    return null;
  }
  return data ? mapSupabaseProductToAppProduct(data) : null;
}

export async function getRelatedProducts(
  categoryName: string,
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  // First, find the category ID from the name
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (categoryError || !category) {
    console.error('Error fetching category for related products:', categoryError);
    return [];
  }

  // Now, fetch products in that category, excluding the current one.
  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .eq('category_id', category.id)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data ? data.map(mapSupabaseProductToAppProduct) : [];
}


export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .in('id', productIds);

  if (error) {
    console.error('Error fetching products by IDs. Supabase error:', error);
    if (typeof error === 'object' && error !== null) {
      console.error('Error message:', (error as any).message);
      console.error('Error details:', (error as any).details);
      console.error('Error code:', (error as any).code);
      console.error('Full error object (stringified):', JSON.stringify(error, null, 2));
    } else {
      console.error('Full error (primitive):', error);
    }
    return [];
  }
  return data ? data.map(mapSupabaseProductToAppProduct) : [];
}
