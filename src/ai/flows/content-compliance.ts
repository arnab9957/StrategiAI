'use server';
/**
 * @fileOverview Checks if content is compliant with regulatory issues.
 *
 * - regulatoryComplianceChecker - A function that checks content compliance.
 * - RegulatoryComplianceInput - The input type for the regulatoryComplianceChecker function.
 * - RegulatoryComplianceOutput - The return type for the regulatoryComplianceChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegulatoryComplianceInputSchema = z.object({
  content: z.string().describe('The content to check for regulatory compliance.'),
});
export type RegulatoryComplianceInput = z.infer<typeof RegulatoryComplianceInputSchema>;

const RegulatoryComplianceOutputSchema = z.object({
  isCompliant: z.boolean().describe('Whether the content is compliant with regulations.'),
  explanation: z.string().describe('Explanation of why the content is compliant or not.'),
});
export type RegulatoryComplianceOutput = z.infer<typeof RegulatoryComplianceOutputSchema>;

export async function regulatoryComplianceChecker(
  input: RegulatoryComplianceInput
): Promise<RegulatoryComplianceOutput> {
  return regulatoryComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regulatoryCompliancePrompt',
  input: {schema: RegulatoryComplianceInputSchema},
  output: {schema: RegulatoryComplianceOutputSchema},
  prompt: `You are an AI expert in regulatory compliance.

You will be provided content and must determine if it is compliant with regulations.

Content: {{{content}}}

Explain your reasoning and provide a determination as to whether it is compliant or not.
`,
});

const regulatoryComplianceFlow = ai.defineFlow(
  {
    name: 'regulatoryComplianceFlow',
    inputSchema: RegulatoryComplianceInputSchema,
    outputSchema: RegulatoryComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
