'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Report, TimelineEvent } from '@/lib/types';
import { updateDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimelineProps {
  report: Report;
}

export function Timeline({ report }: TimelineProps) {
  const [newEvent, setNewEvent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleAddTimelineEvent = async () => {
    if (!newEvent.trim() || !firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Timeline event cannot be empty.',
      });
      return;
    }

    setIsSubmitting(true);

    const newTimelineEntry: TimelineEvent = {
      time: new Date().toISOString(),
      event: newEvent,
      author: user.displayName || user.email || 'System Admin',
    };

    const updatedTimeline = [...report.timeline, newTimelineEntry];
    const reportRef = doc(firestore, 'reports', report.id);
    
    try {
      updateDocumentNonBlocking(reportRef, { timeline: updatedTimeline });
      toast({
        title: 'Timeline Updated',
        description: 'New event added to the incident timeline.',
      });
      setNewEvent('');
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Incident Timeline</CardTitle>
            <CardDescription>Chronological log of events.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Timeline Event</DialogTitle>
                <DialogDescription>
                  Enter a description for the new timeline event. The timestamp and author will be recorded automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-description" className="text-right">
                    Event
                  </Label>
                  <Input
                    id="event-description"
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Fire truck dispatched"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTimelineEvent} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {report.timeline && report.timeline.length > 0 ? (
            [...report.timeline]
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.author === 'AI Assistant' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {item.author === 'AI Assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    {index < report.timeline.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
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
              No timeline events recorded. Add the first event.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
