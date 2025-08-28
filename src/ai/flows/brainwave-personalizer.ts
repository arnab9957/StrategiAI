'use server';

/**
 * @fileOverview This file defines a Genkit flow for adapting content to individual brainwave patterns.
 *
 * - brainwavePersonalizer - A function that personalizes content based on brainwave patterns.
 * - BrainwavePersonalizerInput - The input type for the brainwavePersonalizer function.
 * - BrainwavePersonalizerOutput - The return type for the brainwavePersonalizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainwavePersonalizerInputSchema = z.object({
  brainwaveDataUri: z
    .string()
    .describe(
      'The user brainwave data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      ),
  contentType: z.string().describe('The type of content to be personalized (e.g., text, image, video).'),
  content: z.string().describe('The content to be personalized.'),
});
export type BrainwavePersonalizerInput = z.infer<typeof BrainwavePersonalizerInputSchema>;

const BrainwavePersonalizerOutputSchema = z.object({
  personalizedContent: z.string().describe('The content personalized based on the brainwave data.'),
  explanation: z.string().describe('Explanation of the personalization adjustments.'),
});
export type BrainwavePersonalizerOutput = z.infer<typeof BrainwavePersonalizerOutputSchema>;

export async function brainwavePersonalizer(input: BrainwavePersonalizerInput): Promise<BrainwavePersonalizerOutput> {
  return brainwavePersonalizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainwavePersonalizerPrompt',
  input: {schema: BrainwavePersonalizerInputSchema},
  output: {schema: BrainwavePersonalizerOutputSchema},
  prompt: `You are an AI expert in content personalization based on brainwave patterns. You will receive brainwave data and content, and you must personalize the content to maximize user engagement.

Brainwave Data: {{media url=brainwaveDataUri}}
Content Type: {{{contentType}}}
Original Content: {{{content}}}

Personalized Content:`, // The AI will generate the personalized content here.
});

const brainwavePersonalizerFlow = ai.defineFlow(
  {
    name: 'brainwavePersonalizerFlow',
    inputSchema: BrainwavePersonalizerInputSchema,
    outputSchema: BrainwavePersonalizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
