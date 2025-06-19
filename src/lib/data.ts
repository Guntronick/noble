
import type { Product, Category, ProductImageStructure } from './types';
import { supabase } from './supabaseClient';

// Helper function to map Supabase product (snake_case, with joined category) to our Product type (camelCase)
function mapSupabaseProductToAppProduct(supabaseProduct: any): Product {
  let imagesData: ProductImageStructure = { default: [] };

  if (supabaseProduct.images && typeof supabaseProduct.images === 'object' && supabaseProduct.images !== null) {
    // Populate default images
    if (Array.isArray(supabaseProduct.images.default) && supabaseProduct.images.default.every((img: any) => typeof img === 'string')) {
      imagesData.default = supabaseProduct.images.default.length > 0 ? supabaseProduct.images.default : ['https://placehold.co/600x500.png'];
    } else {
      imagesData.default = ['https://placehold.co/600x500.png'];
    }

    // Populate color-specific images
    for (const color in supabaseProduct.images) {
      if (color !== 'default' && Array.isArray(supabaseProduct.images[color]) && supabaseProduct.images[color].every((img: any) => typeof img === 'string') && supabaseProduct.images[color].length > 0) {
        imagesData[color] = supabaseProduct.images[color];
      }
    }
  } else if (Array.isArray(supabaseProduct.images) && supabaseProduct.images.every((img: any) => typeof img === 'string')) {
    imagesData.default = supabaseProduct.images.length > 0 ? supabaseProduct.images : ['https://placehold.co/600x500.png'];
  } else {
    imagesData.default = ['https://placehold.co/600x500.png'];
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
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  if (options?.categorySlug) {
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
    console.error('Error fetching products. Supabase error:', error);
    if (typeof error === 'object' && error !== null) {
      console.error('Error message:', (error as any).message);
      console.error('Error details:', (error as any).details);
      console.error('Error code:', (error as any).code);
      console.error('Full error object (stringified):', JSON.stringify(error, null, 2));
    }
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
    .select('*, categories(name, slug)')
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

export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
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

