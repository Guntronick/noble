'use server';

import {
  getProductsByIds as getProductsByIdsFromServer,
  getProductBySlug as getProductBySlugFromServer,
  getRelatedProducts as getRelatedProductsFromServer,
  getProducts as getProductsFromServer,
} from '@/lib/data';
import type { Product } from '@/lib/types';
import { getPersonalizedRecommendations, RecommendationRequest, RecommendationResponse } from '@/ai/flows/recommend-products-flow';


/**
 * A Server Action that safely exposes the server-only getProductsByIds function
 * to client components.
 * @param productIds - An array of product IDs to fetch.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  return await getProductsByIdsFromServer(productIds);
}

/**
 * A Server Action that safely exposes the server-only getProductBySlug function
 * to client components.
 * @param slug - The product slug.
 * @returns A promise that resolves to a Product object or null.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    return await getProductBySlugFromServer(slug);
}

/**
 * A Server Action that safely exposes the server-only getRelatedProducts function
 * to client components.
 * @param categoryName - The name of the category.
 * @param currentProductId - The ID of the current product to exclude.
 * @param limit - The maximum number of related products to return.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getRelatedProducts(categoryName: string, currentProductId: string, limit: number = 4): Promise<Product[]> {
    return await getRelatedProductsFromServer(categoryName, currentProductId, limit);
}

/**
 * A Server Action that safely exposes the server-only getProducts function
 * to client components.
 * @param options - Options for filtering, like categorySlug and limit.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProducts(options?: { categorySlug?: string; limit?: number }): Promise<Product[]> {
    return await getProductsFromServer(options);
}

/**
 * A Server Action that safely exposes the AI recommendation flow to client components.
 * It includes the caching logic.
 * @param request - The request object for recommendations.
 * @param viewedProductIds - The array of viewed product IDs for the cache key.
 * @returns A promise that resolves to a RecommendationResponse object.
 */
export async function getPersonalizedRecommendationsAction(
    request: RecommendationRequest,
    viewedProductIds: string[],
): Promise<RecommendationResponse> {
    return getPersonalizedRecommendations(request, viewedProductIds);
}