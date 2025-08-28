'use server';

/**
 * @fileOverview Optimizes AI computations for minimal environmental impact.
 *
 * - greenAIProcessing - A function that optimizes AI computations for minimal environmental impact.
 * - GreenAIProcessingInput - The input type for the greenAIProcessing function.
 * - GreenAIProcessingOutput - The return type for the greenAIProcessing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GreenAIProcessingInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the AI task to be optimized.'),
  modelName: z.string().optional().describe('The name of the AI model being used.'),
  dataSize: z.string().optional().describe('The size of the data being processed.'),
});
export type GreenAIProcessingInput = z.infer<typeof GreenAIProcessingInputSchema>;

const GreenAIProcessingOutputSchema = z.object({
  optimizedInstructions: z
    .string()
    .describe(
      'Instructions to optimize the AI computations for minimal environmental impact.'
    ),
  estimatedImpactReduction: z
    .string()
    .describe('The estimated reduction in environmental impact as a percentage.'),
});
export type GreenAIProcessingOutput = z.infer<typeof GreenAIProcessingOutputSchema>;

export async function greenAIProcessing(input: GreenAIProcessingInput): Promise<GreenAIProcessingOutput> {
  return greenAIProcessingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'greenAIProcessingPrompt',
  input: {schema: GreenAIProcessingInputSchema},
  output: {schema: GreenAIProcessingOutputSchema},
  prompt: `You are an AI expert specializing in optimizing AI computations for minimal environmental impact. Provide clear and actionable instructions to reduce energy consumption and carbon footprint.

Task Description: {{{taskDescription}}}
Model Name: {{{modelName}}}
Data Size: {{{dataSize}}}

Instructions:
1. Provide techniques for reducing model size and complexity without significant loss of accuracy.
2. Recommend efficient data processing methods, such as reducing data size or using optimized data structures.
3. Suggest hardware and software configurations that minimize energy consumption.
4. Estimate the percentage reduction in environmental impact after implementing these optimizations.
`,
});

const greenAIProcessingFlow = ai.defineFlow(
  {
    name: 'greenAIProcessingFlow',
    inputSchema: GreenAIProcessingInputSchema,
    outputSchema: GreenAIProcessingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
