'use server';
/**
 * @fileoverview Extracts key information for responders from a report description.
 *
 * - extractResponderInfo - A function that calls the Genkit flow to extract info.
 */

import { ai } from '@/ai/genkit';
import {
  ExtractInfoInputSchema,
  ExtractInfoOutputSchema,
  type ExtractInfoInput,
  type ExtractInfoOutput
} from '@/ai/flows/types';

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
