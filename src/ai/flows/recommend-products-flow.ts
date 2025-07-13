
'use server';
/**
 * @fileOverview An AI flow for generating personalized product recommendations.
 * 
 * - getPersonalizedRecommendations - Analyzes a user's viewing history and recommends product categories.
 * - RecommendationRequest - The input type for the recommendation flow.
 * - RecommendationResponse - The output type for the recommendation flow.
 */

import { ai } from '@/ai/genkit';
import { getRecommendationFromCache, saveRecommendationToCache } from '@/lib/data';
import { z } from 'zod';

const ViewedProductSchema = z.object({
  name: z.string().describe('The name of the product the user viewed.'),
  description: z.string().nullable().describe('The description of the product.'),
  category: z.string().describe('The category of the product.'),
});

const RecommendationRequestSchema = z.object({
  viewedProducts: z.array(ViewedProductSchema).describe('A list of products the user has recently viewed.'),
});
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

const RecommendationResponseSchema = z.object({
  interestSummary: z.string().describe("A brief, one-sentence summary of the user's likely interests based on their browsing history."),
  recommendedCategorySlugs: z.array(z.string()).describe("A list of up to 3 relevant category slugs (e.g., 'tazas', 'accesorios-tech', 'indumentaria') that the user might be interested in. These slugs must be based on the categories from the viewed products."),
});
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;


const recommendationPrompt = ai.definePrompt({
    name: 'productRecommenderPrompt',
    input: { schema: RecommendationRequestSchema },
    output: { schema: RecommendationResponseSchema },
    prompt: `You are an expert e-commerce merchandiser for a tech and design-focused merchandise store.
Your goal is to provide personalized product category recommendations based on a user's viewing history.

Analyze the following list of recently viewed products:
{{#each viewedProducts}}
- Name: {{name}}
  Category: {{category}}
  Description: {{description}}
{{/each}}

Based on this history, determine the user's primary interests.
Generate a short summary of these interests.
Then, identify the top 2-3 most relevant and distinct category slugs that would appeal to this user.
The slugs should be derived from the 'Category' field of the viewed products. For example if a category is "Tazas y Mates", the slug could be "tazas-y-mates". If the category is "Indumentaria", the slug could be "indumentaria".

Return your response in the specified JSON format.
`,
});

const recommendFlow = ai.defineFlow(
  {
    name: 'recommendFlow',
    inputSchema: RecommendationRequestSchema,
    outputSchema: RecommendationResponseSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    if (!output) {
        // Fallback or error handling
        return {
            interestSummary: "No specific interests could be determined.",
            recommendedCategorySlugs: [],
        };
    }
    return output;
  }
);

// This is the function that will be called from our components.
// It now includes the caching logic.
export async function getPersonalizedRecommendations(
  request: RecommendationRequest,
  viewedProductIds: string[],
): Promise<RecommendationResponse> {

  // 1. Check the cache first
  const cachedRecommendation = await getRecommendationFromCache(viewedProductIds);
  if (cachedRecommendation) {
    console.log("✅ Cache hit! Serving recommendation from cache.");
    return cachedRecommendation;
  }
  
  console.log("⚠️ Cache miss. Calling AI to generate new recommendation.");

  // 2. If not in cache, call the AI flow
  const newRecommendation = await recommendFlow(request);

  // 3. Save the new recommendation to the cache for future requests
  if (newRecommendation && newRecommendation.recommendedCategorySlugs.length > 0) {
    await saveRecommendationToCache(viewedProductIds, newRecommendation);
    console.log("💾 New recommendation saved to cache.");
  }
  
  return newRecommendation;
}
