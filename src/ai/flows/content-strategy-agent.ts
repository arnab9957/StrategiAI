'use server';

/**
 * @fileOverview An AI content strategy agent that autonomously plans and executes content strategies based on performance data.
 *
 * - autonomousContentStrategy - A function that handles the content strategy generation and execution process.
 * - AutonomousContentStrategyInput - The input type for the autonomousContentStrategy function.
 * - AutonomousContentStrategyOutput - The return type for the autonomousContentStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutonomousContentStrategyInputSchema = z.object({
  brandDescription: z
    .string()
    .describe('A description of the brand for which the content strategy is being created.'),
  targetAudience: z.string().describe('A description of the target audience.'),
  campaignGoals: z.string().describe('The goals of the content marketing campaign.'),
  performanceData: z
    .string()
    .optional()
    .describe('Historical performance data of previous content, if available.'),
});
export type AutonomousContentStrategyInput = z.infer<
  typeof AutonomousContentStrategyInputSchema
>;

const AutonomousContentStrategyOutputSchema = z.object({
  sevenDayContentPlan: z
    .string()
    .describe('A detailed 7-day content plan with specific post ideas and timing.'),
  performancePredictions: z
    .string()
    .describe('Predictions of content performance based on the generated plan.'),
  optimizationSuggestions: z
    .string()
    .describe('Suggestions for optimizing the content plan based on predicted performance.'),
});

export type AutonomousContentStrategyOutput = z.infer<
  typeof AutonomousContentStrategyOutputSchema
>;

export async function autonomousContentStrategy(
  input: AutonomousContentStrategyInput
): Promise<AutonomousContentStrategyOutput> {
  return autonomousContentStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autonomousContentStrategyPrompt',
  input: {schema: AutonomousContentStrategyInputSchema},
  output: {schema: AutonomousContentStrategyOutputSchema},
  prompt: `You are an AI content strategy agent. Your goal is to autonomously plan and execute content strategies based on performance data.

You will generate a 7-day content plan, predict content performance, and provide optimization suggestions.

Brand Description: {{{brandDescription}}}
Target Audience: {{{targetAudience}}}
Campaign Goals: {{{campaignGoals}}}

{{#if performanceData}}
Performance Data:
{{{performanceData}}}
{{/if}}
`,
});

const autonomousContentStrategyFlow = ai.defineFlow(
  {
    name: 'autonomousContentStrategyFlow',
    inputSchema: AutonomousContentStrategyInputSchema,
    outputSchema: AutonomousContentStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
