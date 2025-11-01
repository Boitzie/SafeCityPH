'use server';
/**
 * @fileoverview A flow to generate a monthly activity log from report timelines.
 * 
 * - generateActivityLog - A function that calls the Genkit flow to summarize timeline events.
 */

import { ai } from '@/ai/genkit';
import {
    ActivityLogInputSchema,
    ActivityLogOutputSchema,
    type ActivityLogInput,
    type ActivityLogOutput
} from '@/ai/flows/activity-log-types';
import { format, parseISO } from 'date-fns';

const generateLogPrompt = ai.definePrompt({
    name: 'generateLogPrompt',
    input: { schema: ActivityLogInputSchema },
    output: { schema: ActivityLogOutputSchema },
    prompt: `You are a helpful assistant for an emergency response system. Your task is to create a detailed and well-structured activity log for the month of {{month}}.

Analyze the following timeline events, which are provided as a JSON array. Each event includes 'time', 'event' description, 'reportId', and 'title'.

Your task is to:
1.  Organize all events chronologically in descending order (newest first).
2.  Group the events by date.
3.  Under each date, group the events by their corresponding incident report ('reportId' and 'title').
4.  List the timeline events for each report with their timestamp.
5.  Format the output as a clean, human-readable text log.

Example Output:
"
Activity Log for October 2025
==============================

October 11, 2025
-----------------

Incident: #RPT-20251011-FIR-078 - Residential Fire – Structure Fire Reported
  - 17:55: Firefighters on site; active suppression operations in progress.
  - 17:42: Fire response units and EMTs dispatched.
  - 17:36: Acknowledged by Makati Fire Station and Barangay Fire Brigade.
  - 17:33: Report submitted by Maria Dela Cruz.

Incident: #RPT-20251010-FIR-077 - Vehicle Accident - Multiple Cars
  - 16:50: Responders on site; attending to injured individuals.
  - 16:38: Ambulance and traffic enforcers dispatched.
  - 16:33: Acknowledged by MAPSA and Makati Police Department.
  - 16:30: Report submitted by citizen.

Incident: #RPT-20251009-FIR-076 - Flooding Incident - Severe
  - 15:15: Report submitted by Roberto Santos.

October 10, 2025
-----------------

Incident: #RPT-20251008-FIR-075 - Structural Collapse - Partial
  - 23:10: Debris cleared; structural assessment complete.
  - 22:55: Safety inspectors arrived; area secured.
  - 22:47: Acknowledged by Department of Engineering and Safety.
  - 22:45: Report submitted by Liza Ramos.
... and so on
"

Here is the JSON data of timeline events:
{{{json timeline}}}
`,
});

const generateActivityLogFlow = ai.defineFlow(
    {
        name: 'generateActivityLogFlow',
        inputSchema: ActivityLogInputSchema,
        outputSchema: ActivityLogOutputSchema,
    },
    async (input) => {
        // Sort events chronologically descending before sending to the AI
        const sortedTimeline = [...input.timeline].sort((a, b) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        const { output } = await generateLogPrompt({ ...input, timeline: sortedTimeline });
        return output!;
    }
);

export async function generateActivityLog(
    input: ActivityLogInput
): Promise<ActivityLogOutput> {
    return await generateActivityLogFlow(input);
}
