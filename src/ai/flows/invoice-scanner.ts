
'use server';
/**
 * @fileOverview An AI flow to extract structured data from an invoice image.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction.
 * - ExtractInvoiceInput - The input type for the extractInvoiceData function.
 * - ExtractInvoiceOutput - The return type for the extractInvoiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ExtractInvoiceInputSchema = z.object({
  image_data_uri: z
    .string()
    .describe(
      "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInvoiceInput = z.infer<typeof ExtractInvoiceInputSchema>;


const ExtractedItemSchema = z.object({
    itemName: z.string().describe('The name of the item or service.'),
    quantity: z.number().describe('The quantity of the item.'),
    price: z.number().describe('The unit price of the item.'),
    discount: z.number().describe('The discount percentage applied to the item. Default to 0 if not present.'),
});

export const ExtractInvoiceOutputSchema = z.object({
  customerName: z.string().describe("The full name of the customer or 'Bill To' person/company."),
  customerEmail: z.string().describe("The email address of the customer."),
  items: z.array(ExtractedItemSchema).describe('An array of all line items from the invoice.'),
  grandTotalDiscount: z.number().describe("The overall discount percentage applied to the grand total. Default to 0 if not present."),
});
export type ExtractInvoiceOutput = z.infer<typeof ExtractInvoiceOutputSchema>;


export async function extractInvoiceData(input: ExtractInvoiceInput): Promise<ExtractInvoiceOutput> {
  return extractInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceInputSchema},
  output: {schema: ExtractInvoiceOutputSchema},
  prompt: `You are an expert at accurately extracting structured data from invoice images.

Your task is to analyze the provided invoice image and extract the following information:
- The customer's full name.
- The customer's email address.
- A list of all line items, including their name, quantity, unit price, and any item-specific discount percentage. If no discount is specified for an item, it should be 0.
- The overall discount percentage applied to the grand total. If no such discount exists, it should be 0.

Pay close attention to details to ensure all values are correct.

Invoice Image: {{media url=image_data_uri}}`,
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceInputSchema,
    outputSchema: ExtractInvoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    