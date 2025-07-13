'use server';

import { getProductsByIds as getProductsByIdsFromServer } from '@/lib/data';
import type { Product } from '@/lib/types';

/**
 * A Server Action that safely exposes the server-only getProductsByIds function
 * to client components.
 * @param productIds - An array of product IDs to fetch.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  return await getProductsByIdsFromServer(productIds);
}
