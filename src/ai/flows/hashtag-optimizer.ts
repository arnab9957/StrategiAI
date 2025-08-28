'use server';
/**
 * @fileOverview A hashtag optimization AI agent.
 *
 * - optimizeHashtags - A function that handles the hashtag optimization process.
 * - OptimizeHashtagsInput - The input type for the optimizeHashtags function.
 * - OptimizeHashtagsOutput - The return type for the optimizeHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeHashtagsInputSchema = z.object({
  postContent: z.string().describe('The content of the social media post.'),
  platform: z
    .string()
    .describe('The social media platform (e.g., Instagram, Twitter, TikTok).'),
  brandKeywords: z
    .string()
    .optional()
    .describe('Optional keywords related to the brand or niche.'),
});
export type OptimizeHashtagsInput = z.infer<typeof OptimizeHashtagsInputSchema>;

const OptimizeHashtagsOutputSchema = z.object({
  optimizedHashtags: z
    .string()
    .describe('A list of optimized hashtags for the post, separated by spaces.'),
  explanation: z
    .string()
    .describe('An explanation of why these hashtags were chosen.'),
});
export type OptimizeHashtagsOutput = z.infer<typeof OptimizeHashtagsOutputSchema>;

export async function optimizeHashtags(
  input: OptimizeHashtagsInput
): Promise<OptimizeHashtagsOutput> {
  return optimizeHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeHashtagsPrompt',
  input: {schema: OptimizeHashtagsInputSchema},
  output: {schema: OptimizeHashtagsOutputSchema},
  prompt: `You are an expert social media strategist specializing in hashtag optimization.

  Given the content of a social media post, the platform it will be posted on, and optional brand keywords, you will generate a list of optimized hashtags that will increase the reach of the content.

  Content: {{{postContent}}}
  Platform: {{{platform}}}
  Brand Keywords: {{#if brandKeywords}}{{{brandKeywords}}}{{else}}N/A{{/if}}

  Provide a brief explanation of why these hashtags were chosen.
  Separate hashtags by spaces.
  Limit hashtags to a reasonable number for the specified platform.

  Your response should be formatted as follows:

  Optimized Hashtags: [list of hashtags]
  Explanation: [explanation of why these hashtags were chosen]`,
});

const optimizeHashtagsFlow = ai.defineFlow(
  {
    name: 'optimizeHashtagsFlow',
    inputSchema: OptimizeHashtagsInputSchema,
    outputSchema: OptimizeHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
