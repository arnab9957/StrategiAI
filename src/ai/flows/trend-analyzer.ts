'use server';
/**
 * @fileOverview Trend contextualization AI agent.
 *
 * - trendContextualize - A function that handles the trend contextualization process.
 * - TrendContextualizeInput - The input type for the trendContextualize function.
 * - TrendContextualizeOutput - The return type for the trendContextualize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendContextualizeInputSchema = z.object({
  topic: z.string().describe('The trending topic to analyze.'),
});
export type TrendContextualizeInput = z.infer<typeof TrendContextualizeInputSchema>;

const TrendContextualizeOutputSchema = z.object({
  explanation: z.string().describe('Explanation of why the topic is trending.'),
});
export type TrendContextualizeOutput = z.infer<typeof TrendContextualizeOutputSchema>;

export async function trendContextualize(input: TrendContextualizeInput): Promise<TrendContextualizeOutput> {
  return trendContextualizeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trendContextualizePrompt',
  input: {schema: TrendContextualizeInputSchema},
  output: {schema: TrendContextualizeOutputSchema},
  prompt: `You are an expert social media analyst. Your job is to explain why a certain topic is trending.

Topic: {{{topic}}}

Explanation:`,
});

const trendContextualizeFlow = ai.defineFlow(
  {
    name: 'trendContextualizeFlow',
    inputSchema: TrendContextualizeInputSchema,
    outputSchema: TrendContextualizeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
