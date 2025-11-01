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
    prompt: `You are an intelligent assistant for an emergency response system. 
    
Your task is to process the information provided and return it in a structured format.

1.  **reporterName**: Use the value "{{reporterName}}".
2.  **reporterContact**: Use the value "{{reporterContact}}".
3.  **location**: From the following incident description, identify and extract only the specific location of the incident.

Incident Description:
"{{description}}"

Return this information in the specified JSON format.`,
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
