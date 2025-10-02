'use server';

/**
 * @fileOverview Implements global search functionality to locate stock items, sales records, or customer information.
 *
 * - globalSearch - A function that handles the global search process.
 * - GlobalSearchInput - The input type for the globalSearch function.
 * - GlobalSearchOutput - The return type for the globalSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GlobalSearchInputSchema = z.object({
  query: z.string().describe('The search query to use for finding relevant data.'),
});
export type GlobalSearchInput = z.infer<typeof GlobalSearchInputSchema>;

const GlobalSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('An array of search results matching the query.'),
});
export type GlobalSearchOutput = z.infer<typeof GlobalSearchOutputSchema>;

export async function globalSearch(input: GlobalSearchInput): Promise<GlobalSearchOutput> {
  return globalSearchFlow(input);
}

const globalSearchPrompt = ai.definePrompt({
  name: 'globalSearchPrompt',
  input: {schema: GlobalSearchInputSchema},
  output: {schema: GlobalSearchOutputSchema},
  prompt: `You are an expert search assistant for an admin panel.

  Based on the user's query, search for relevant stock items, sales records, and customer information.
  Return the results in a JSON array of strings.

  Query: {{{query}}}`,
});

const globalSearchFlow = ai.defineFlow(
  {
    name: 'globalSearchFlow',
    inputSchema: GlobalSearchInputSchema,
    outputSchema: GlobalSearchOutputSchema,
  },
  async input => {
    const {output} = await globalSearchPrompt(input);
    return output!;
  }
);
