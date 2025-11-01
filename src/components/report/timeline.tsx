'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { Wand2, Loader2, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Report, TimelineEvent } from '@/lib/types';
import { generateTimelineAction } from '@/app/actions';
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

interface TimelineProps {
  report: Report;
}

export function Timeline({ report }: TimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(report.timeline.map(t => ({...t, time: new Date(t.time).toISOString() })));
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleGenerateTimeline = () => {
    startTransition(async () => {
      const result = await generateTimelineAction({
        title: report.title,
        description: report.description,
        dateTime: report.dateTime,
        location: report.location,
      });

      if (result.success && result.data && firestore) {
        const newEvents: TimelineEvent[] = result.data.timeline.map(item => ({
          time: new Date(item.time).toISOString(),
          event: item.event,
          author: 'AI Assistant'
        }));
        
        setTimelineEvents(newEvents);
        const reportRef = doc(firestore, 'reports', report.id);
        updateDocumentNonBlocking(reportRef, { timeline: newEvents });
        
        toast({
          title: 'Timeline Generated',
          description: 'AI has created an initial timeline for this incident.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Timeline',
          description: result.error || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Incident Timeline</CardTitle>
            <CardDescription>Chronological log of events.</CardDescription>
          </div>
          <Button onClick={handleGenerateTimeline} disabled={isPending} size="sm">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.length > 0 ? (
            timelineEvents
              .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
              .map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.author === 'AI Assistant' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {item.author === 'AI Assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    {index < timelineEvents.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-baseline justify-between">
                        <p className="font-medium">{item.event}</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(item.time), 'HH:mm')}
                        </p>
                    </div>
                     <p className="text-sm text-muted-foreground">{format(new Date(item.time), 'MMM d, yyyy')}</p>
                    {item.author && <p className="mt-1 text-xs text-muted-foreground">by {item.author}</p>}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No timeline events recorded. Try generating one with AI.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
