'use server';

/**
 * @fileOverview A flow to generate an initial incident timeline from the report details using AI.
 *
 * - generateIncidentTimeline - A function that handles the incident timeline generation.
 * - GenerateIncidentTimelineInput - The input type for the generateIncidentTimeline function.
 * - GenerateIncidentTimelineOutput - The return type for the generateIncidentTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIncidentTimelineInputSchema = z.object({
  title: z.string().describe('The title of the incident report.'),
  description: z.string().describe('The description of the incident.'),
  dateTime: z.string().describe('The date and time of the incident.'),
  location: z.string().describe('The location of the incident.'),
});
export type GenerateIncidentTimelineInput = z.infer<typeof GenerateIncidentTimelineInputSchema>;

const GenerateIncidentTimelineOutputSchema = z.object({
  timeline: z.array(
    z.object({
      time: z.string().describe('The time of the event.'),
      event: z.string().describe('The description of the event.'),
    })
  ).describe('A chronological timeline of events based on the incident report.'),
});
export type GenerateIncidentTimelineOutput = z.infer<typeof GenerateIncidentTimelineOutputSchema>;

export async function generateIncidentTimeline(input: GenerateIncidentTimelineInput): Promise<GenerateIncidentTimelineOutput> {
  return generateIncidentTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIncidentTimelinePrompt',
  input: {schema: GenerateIncidentTimelineInputSchema},
  output: {schema: GenerateIncidentTimelineOutputSchema},
  prompt: `You are an expert incident timeline generator. Given the details of an incident report, create a chronological timeline of events.

Incident Title: {{{title}}}
Incident Date and Time: {{{dateTime}}}
Incident Location: {{{location}}}
Incident Description: {{{description}}}

Generate a timeline with specific times and descriptions of events.  The times should reflect the actual incident time, so don't make the times relative (e.g. "5 minutes later..."), but instead absolute (e.g. 14:05).`,
});

const generateIncidentTimelineFlow = ai.defineFlow(
  {
    name: 'generateIncidentTimelineFlow',
    inputSchema: GenerateIncidentTimelineInputSchema,
    outputSchema: GenerateIncidentTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
