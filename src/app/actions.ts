
'use server';

import { generateIncidentTimeline, type GenerateIncidentTimelineInput } from '@/ai/flows/generate-incident-timeline';

export async function generateTimelineAction(input: GenerateIncidentTimelineInput) {
  try {
    const output = await generateIncidentTimeline(input);
    return { success: true, data: output };
  } catch (error: any) {
    console.error('Error generating timeline:', error);
    return { success: false, error: error.message || 'Failed to generate timeline.' };
  }
}
