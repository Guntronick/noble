
'use server';

/**
 * @fileOverview Provides product recommendations based on the category of a viewed product.
 *
 * - getRelatedProducts - A function to retrieve related products.
 * - RelatedProductsInput - Input type for the getRelatedProducts function.
 * - RelatedProductsOutput - Output type for the getRelatedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelatedProductsInputSchema = z.object({
  category: z.string().describe('The category of the product.'),
  productId: z.string().uuid().describe('The ID (UUID) of the product being viewed.'),
  numberOfProducts: z
    .number()
    .default(3)
    .describe('The number of related products to return.'),
});
export type RelatedProductsInput = z.infer<typeof RelatedProductsInputSchema>;

const RelatedProductsOutputSchema = z.array(
  z.object({
    productId: z.string().describe('The ID of the related product. IMPORTANT: This ID MUST be a valid UUID string.'),
    name: z.string().describe('The name of the related product.'),
    imageUrl: z.string().describe("URL of the product image. IMPORTANT: This URL MUST be a placeholder image from 'https://placehold.co'. For example, 'https://placehold.co/600x800.png'. Do not use any other domain."),
    description: z.string().describe('A short description of the product.'),
  })
);
export type RelatedProductsOutput = z.infer<typeof RelatedProductsOutputSchema>;

export async function getRelatedProducts(input: RelatedProductsInput): Promise<RelatedProductsOutput> {
  return relatedProductsFlow(input);
}

const relatedProductsPrompt = ai.definePrompt({
  name: 'relatedProductsPrompt',
  input: {
    schema: RelatedProductsInputSchema,
  },
  output: {
    schema: RelatedProductsOutputSchema, // This schema is sent to Google AI for response structuring
  },
  prompt: `You are an expert in product recommendations.

  Based on the category of the viewed product, recommend {{numberOfProducts}} other products from the same category that the user might be interested in.
  Ensure that the recommendations are diverse and not simply variations of the same product.

  Category: {{category}}
  Viewed Product ID (UUID): {{productId}}

  Return a JSON array of related products with the following fields:
  - productId: The ID of the related product. IMPORTANT: This ID MUST be a valid UUID string.
  - name: The name of the related product.
  - imageUrl: URL of the product image. IMPORTANT: This URL MUST be a placeholder image from 'https://placehold.co'. For example, 'https://placehold.co/600x800.png'. Do not use any other domain.
  - description: A short description of the product.
  `,
});

const relatedProductsFlow = ai.defineFlow(
  {
    name: 'relatedProductsFlow',
    inputSchema: RelatedProductsInputSchema,
    outputSchema: RelatedProductsOutputSchema, // Genkit validates the final output against this
  },
  async input => {
    const {output} = await relatedProductsPrompt(input);
    // The output from the LLM will be validated against the flow's outputSchema by Genkit.
    // If the LLM returns a productId that isn't a UUID (despite prompt instructions),
    // or an imageUrl that isn't a valid URL, Zod validation might still catch it here if
    // the flow's outputSchema was stricter (e.g. kept .uuid() and .url()).
    // However, the immediate error is from Google's API schema validation, so we simplify
    // RelatedProductsOutputSchema for that.
    return output!;
  }
);

