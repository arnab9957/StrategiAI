// This is a server-side file!
'use server';

/**
 * @fileOverview A content performance prediction AI agent.
 *
 * - predictContentPerformance - A function that handles the content performance prediction process.
 * - PredictContentPerformanceInput - The input type for the predictContentPerformance function.
 * - PredictContentPerformanceOutput - The return type for the predictContentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictContentPerformanceInputSchema = z.object({
  contentDescription: z.string().describe('Detailed description of the content to be published.'),
  targetAudience: z.string().describe('Description of the target audience for the content.'),
  platform: z.string().describe('The social media platform where the content will be published (e.g., Instagram, YouTube, TikTok).'),
  pastPerformanceData: z.string().optional().describe('Data from past content performance to use as reference.'),
});
export type PredictContentPerformanceInput = z.infer<typeof PredictContentPerformanceInputSchema>;

const PredictContentPerformanceOutputSchema = z.object({
  predictedEngagement: z.number().describe('Predicted engagement rate (likes, shares, comments).'),
  predictedReach: z.number().describe('Predicted reach of the content.'),
  optimizationSuggestions: z.string().describe('Suggestions for optimizing the content to improve performance.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the predictions.'),
});
export type PredictContentPerformanceOutput = z.infer<typeof PredictContentPerformanceOutputSchema>;

export async function predictContentPerformance(input: PredictContentPerformanceInput): Promise<PredictContentPerformanceOutput> {
  return predictContentPerformanceFlow(input);
}

const analyzePerformancePrompt = ai.definePrompt({
  name: 'analyzePerformancePrompt',
  input: {schema: PredictContentPerformanceInputSchema},
  output: {schema: PredictContentPerformanceOutputSchema},
  prompt: `You are an AI expert in predicting social media content performance.

  Based on the content description, target audience, platform, and past performance data, predict the engagement rate and reach of the content.

  Provide specific suggestions for optimizing the content to improve its performance, and provide a confidence score for your predictions.

  Content Description: {{{contentDescription}}}
  Target Audience: {{{targetAudience}}}
  Platform: {{{platform}}}
  Past Performance Data (if available): {{{pastPerformanceData}}}
  `,
});

const predictContentPerformanceFlow = ai.defineFlow(
  {
    name: 'predictContentPerformanceFlow',
    inputSchema: PredictContentPerformanceInputSchema,
    outputSchema: PredictContentPerformanceOutputSchema,
  },
  async input => {
    const {output} = await analyzePerformancePrompt(input);
    return output!;
  }
);
