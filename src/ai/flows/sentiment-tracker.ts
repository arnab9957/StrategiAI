// Implements the realtimeSentimentAnalysis flow to predict and respond to emotional shifts in real-time.
'use server';

/**
 * @fileOverview Tracks real-time sentiment analysis to predict and respond to emotional shifts.
 *
 * - realtimeSentimentAnalysis - A function that analyzes real-time sentiment shifts.
 * - RealtimeSentimentAnalysisInput - The input type for the realtimeSentimentAnalysis function.
 * - RealtimeSentimentAnalysisOutput - The return type for the realtimeSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealtimeSentimentAnalysisInputSchema = z.object({
  text: z.string().describe('The text to analyze for sentiment.'),
});
export type RealtimeSentimentAnalysisInput = z.infer<
  typeof RealtimeSentimentAnalysisInputSchema
>;

const RealtimeSentimentAnalysisOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The overall sentiment of the text (e.g., positive, negative, neutral).'
    ),
  confidence: z
    .number()
    .describe(
      'A numerical value representing the confidence level of the sentiment analysis (0 to 1).'
    ),
  emotionalShiftPrediction: z.string().describe('Predicted emotional shifts in real-time')
});
export type RealtimeSentimentAnalysisOutput = z.infer<
  typeof RealtimeSentimentAnalysisOutputSchema
>;

export async function realtimeSentimentAnalysis(
  input: RealtimeSentimentAnalysisInput
): Promise<RealtimeSentimentAnalysisOutput> {
  return realtimeSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realtimeSentimentAnalysisPrompt',
  input: {schema: RealtimeSentimentAnalysisInputSchema},
  output: {schema: RealtimeSentimentAnalysisOutputSchema},
  prompt: `Analyze the sentiment of the following text and predict emotional shifts in real-time. Return the overall sentiment, a confidence score (0 to 1), and the predicted emotional shift.

Text: {{{text}}}

Sentiment: 
Confidence: 
Emotional Shift Prediction:`,
});

const realtimeSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'realtimeSentimentAnalysisFlow',
    inputSchema: RealtimeSentimentAnalysisInputSchema,
    outputSchema: RealtimeSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
