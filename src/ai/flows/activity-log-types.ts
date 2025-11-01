/**
 * @fileoverview Defines the shared types and schemas for the activity log AI flow.
 */

import { z } from 'genkit';
import type { TimelineEvent } from '@/lib/types';

// Schema for the input of the generateActivityLog flow
export const ActivityLogInputSchema = z.object({
  month: z.string().describe('The month and year for the log (e.g., "October 2025").'),
  timeline: z.array(z.any()).describe('An array of timeline event objects from all reports for the month.'),
});
export type ActivityLogInput = z.infer<typeof ActivityLogInputSchema>;

// Schema for the output of the generateActivityLog flow
export const ActivityLogOutputSchema = z.object({
  log: z.string().describe('The formatted, plain-text activity log for the entire month.'),
});
export type ActivityLogOutput = z.infer<typeof ActivityLogOutputSchema>;
