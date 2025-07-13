
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import type { Product, Category, ProductImageStructure } from '@/lib/types';

// Read server-side environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Crucial Supabase environment variables are missing on the server-side.");
  throw new Error("Server-side Supabase environment variables are not defined. Check your .env.local file or hosting configuration.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

const SUPABASE_STORAGE_URL = supabaseUrl;

function constructImageUrl(imagePath: string): string {
  if (!imagePath || imagePath.startsWith('http')) {
    return imagePath || 'https://placehold.co/600x500.png';
  }
  return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/products/${imagePath}`;
}

function mapSupabaseProductToAppProduct(supabaseProduct: any): Product {
  let imagesData: ProductImageStructure = { default: [] };

  if (supabaseProduct.images && typeof supabaseProduct.images === 'object' && supabaseProduct.images !== null) {
    if (Array.isArray(supabaseProduct.images.default) && supabaseProduct.images.default.every((img: any) => typeof img === 'string')) {
      imagesData.default = supabaseProduct.images.default.map(constructImageUrl);
    }
    for (const color in supabaseProduct.images) {
      if (color !== 'default' && Array.isArray(supabaseProduct.images[color]) && supabaseProduct.images[color].every((img: any) => typeof img === 'string') && supabaseProduct.images[color].length > 0) {
        imagesData[color] = supabaseProduct.images[color].map(constructImageUrl);
      }
    }
  } else if (Array.isArray(supabaseProduct.images) && supabaseProduct.images.every((img: any) => typeof img === 'string')) {
     imagesData.default = supabaseProduct.images.map(constructImageUrl);
  }

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
    console.error('Error fetching categories. This is likely a network, DNS, or firewall issue.', JSON.stringify(error, null, 2));
    console.error('ACTION: Please follow the network troubleshooting guide to test connectivity with `curl` or `ping`.');
    return [];
  }
  if (!data || data.length === 0) {
    console.warn("⚠️ Warning: getCategories returned no data. This might be correct, or it could indicate an RLS (Row Level Security) policy is blocking the query. Please check your Supabase 'categories' table policies.");
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
            return [];
        }
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products. This is likely a network, DNS, or firewall issue. Supabase error:', JSON.stringify(error, null, 2));
        console.error('ACTION: Please follow the network troubleshooting guide to test connectivity with `curl` or `ping`.');
        return [];
    }
     if (!data || data.length === 0) {
      console.warn("⚠️ Warning: getProducts returned no data. This might be correct, or it could indicate an RLS (Row Level Security) policy is blocking the query. Please check your Supabase 'products' table policies.");
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
    console.error(`Error fetching product by slug ${slug}. Supabase error:`, JSON.stringify(error, null, 2));
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
    console.error(`Error fetching product by id ${id}. Supabase error:`, JSON.stringify(error, null, 2));
    return null;
  }
  return data ? mapSupabaseProductToAppProduct(data) : null;
}

export async function getRelatedProducts(
  categoryName: string,
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (categoryError || !category) {
    console.error('Error fetching category for related products:', JSON.stringify(categoryError, null, 2));
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .eq('category_id', category.id)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', JSON.stringify(error, null, 2));
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
    console.error('Error fetching products by IDs. Supabase error:', JSON.stringify(error, null, 2));
    return [];
  }
  return data ? data.map(mapSupabaseProductToAppProduct) : [];
}
