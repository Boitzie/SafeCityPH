/**
 * @fileoverview Defines the shared types and schemas for AI flows.
 */

import { z } from 'genkit';

// Schema for the input of the extractResponderInfo flow
export const ExtractInfoInputSchema = z.object({
  description: z.string().describe('The full text description of the incident report.'),
  reporterName: z.string().describe("The name of the person who reported the incident."),
  reporterContact: z.string().describe("The phone number or contact information of the reporter."),
});
export type ExtractInfoInput = z.infer<typeof ExtractInfoInputSchema>;

// Schema for the output of the extractResponderInfo flow
export const ExtractInfoOutputSchema = z.object({
  location: z.string().describe('The specific location of the incident.'),
  reporterName: z.string().describe("The name of the person who reported the incident."),
  reporterContact: z.string().describe("The phone number or contact information of the reporter."),
});
export type ExtractInfoOutput = z.infer<typeof ExtractInfoOutputSchema>;
