'use server';
/**
 * @fileoverview Extracts key information for responders from a report description.
 *
 * - extractResponderInfo - A function that calls the Genkit flow to extract info.
 * - ExtractInfoInput - The input type for the flow.
 * - ExtractInfoOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ExtractInfoInputSchema = z.object({
  description: z.string().describe('The full text description of the incident report.'),
});
export type ExtractInfoInput = z.infer<typeof ExtractInfoInputSchema>;

export const ExtractInfoOutputSchema = z.object({
  location: z.string().describe('The specific location of the incident.'),
  reporterName: z.string().describe("The name of the person who reported the incident."),
  reporterContact: z.string().describe("The phone number or contact information of the reporter."),
});
export type ExtractInfoOutput = z.infer<typeof ExtractInfoOutputSchema>;


const extractInfoPrompt = ai.definePrompt({
    name: 'extractInfoPrompt',
    input: { schema: ExtractInfoInputSchema },
    output: { schema: ExtractInfoOutputSchema },
    prompt: `You are an intelligent assistant for an emergency response system. Your task is to extract critical information from an incident report description.

From the following description, identify:
1. The name of the person who made the report.
2. The contact phone number of the reporter.
3. The specific location of the incident.

Report Description:
"{{description}}"

Extract this information and return it in the specified JSON format. If any piece of information is not present, return an empty string for that field.`,
});


const extractResponderInfoFlow = ai.defineFlow(
  {
    name: 'extractResponderInfoFlow',
    inputSchema: ExtractInfoInputSchema,
    outputSchema: ExtractInfoOutputSchema,
  },
  async (input) => {
    const { output } = await extractInfoPrompt(input);
    return output!;
  }
);

export async function extractResponderInfo(
  input: ExtractInfoInput
): Promise<ExtractInfoOutput> {
  return await extractResponderInfoFlow(input);
}
