'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting micro-trends as early as possible.
 *
 * The flow takes a query as input and returns a list of trending topics with lead times and explanations.
 *
 * @exported diagnosePlant - A function that handles the plant diagnosis process.
 * @exported MicroTrendDetectionInput - The input type for the microTrendDetection function.
 * @exported MicroTrendDetectionOutput - The return type for the microTrendDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MicroTrendDetectionInputSchema = z.object({
  query: z
    .string()
    .describe('A query to detect micro-trends related to a specific topic.'),
});
export type MicroTrendDetectionInput = z.infer<typeof MicroTrendDetectionInputSchema>;

const MicroTrendDetectionOutputSchema = z.object({
  trendingTopics: z
    .array(z.string())
    .describe('A list of trending topics related to the query.'),
  explanations: z
    .array(z.string())
    .describe('Explanations of why the topics are trending.'),
  leadTimes: z
    .array(z.string())
    .describe('Lead times for each trending topic.'),
});
export type MicroTrendDetectionOutput = z.infer<typeof MicroTrendDetectionOutputSchema>;

export async function microTrendDetection(input: MicroTrendDetectionInput): Promise<MicroTrendDetectionOutput> {
  return microTrendDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'microTrendDetectionPrompt',
  input: {schema: MicroTrendDetectionInputSchema},
  output: {schema: MicroTrendDetectionOutputSchema},
  prompt: `You are an expert in identifying micro-trends in social media.
  Given the query: {{{query}}}, identify a list of trending topics, explain why they are trending, and provide lead times for each trend.
  Return the trending topics, explanations, and lead times in a JSON format.
  Trending Topics:
  Explanations:
  Lead Times:`,
});

const microTrendDetectionFlow = ai.defineFlow(
  {
    name: 'microTrendDetectionFlow',
    inputSchema: MicroTrendDetectionInputSchema,
    outputSchema: MicroTrendDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
