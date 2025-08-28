'use server';

/**
 * @fileOverview This file defines a Genkit flow for content repurposing automation.
 *
 * It allows users to repurpose existing content into different formats automatically to maximize reach and impact.
 *   - contentRepurposer - A function that takes content and a desired format and returns repurposed content.
 *   - ContentRepurposerInput - The input type for the contentRepurposer function.
 *   - ContentRepurposerOutput - The return type for the contentRepurposer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRepurposerInputSchema = z.object({
  content: z.string().describe('The content to repurpose.'),
  targetFormat: z.string().describe('The desired format for the repurposed content (e.g., tweet, blog post, short video script).'),
});
export type ContentRepurposerInput = z.infer<typeof ContentRepurposerInputSchema>;

const ContentRepurposerOutputSchema = z.object({
  repurposedContent: z.string().describe('The repurposed content in the specified format.'),
});
export type ContentRepurposerOutput = z.infer<typeof ContentRepurposerOutputSchema>;

export async function contentRepurposer(input: ContentRepurposerInput): Promise<ContentRepurposerOutput> {
  return contentRepurposerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRepurposerPrompt',
  input: {schema: ContentRepurposerInputSchema},
  output: {schema: ContentRepurposerOutputSchema},
  prompt: `You are an expert content repurposer. Please take the following content and repurpose it into the specified format.

Content: {{{content}}}
Target Format: {{{targetFormat}}}

Repurposed Content:`, 
});

const contentRepurposerFlow = ai.defineFlow(
  {
    name: 'contentRepurposerFlow',
    inputSchema: ContentRepurposerInputSchema,
    outputSchema: ContentRepurposerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
