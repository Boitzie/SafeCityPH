
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Report, Department, ReportStatus, TimelineEvent } from '@/lib/types';
import { updateDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';

interface ReportActionsProps {
  report: Report;
  allDepartments: Department[];
}

export function ReportActions({ report, allDepartments }: ReportActionsProps) {
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(report.assignedDepartments || []);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeptDialogOpen, setIsDeptDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setStatus(report.status);
    setSelectedDepartments(report.assignedDepartments || []);
  }, [report]);

  const addTimelineEvent = (eventText: string) => {
    if (!firestore || !user) return;
    
    const newTimelineEntry: TimelineEvent = {
        time: new Date().toISOString(),
        event: eventText,
        author: user.displayName || user.email || 'System Admin',
        authorId: user.uid,
    };

    const updatedTimeline = [...(report.timeline || []), newTimelineEntry];
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { timeline: updatedTimeline });
  };


  const handleStatusUpdate = () => {
    if (!firestore) return;
    setIsSubmitting(true);
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { status });

    addTimelineEvent(`Status updated to "${status}"`);

    toast({
      title: 'Status Updated',
      description: `Report status changed to ${status}.`,
    });
    setIsSubmitting(false);
    setIsStatusDialogOpen(false);
  };

  const handleDepartmentUpdate = () => {
    if (!firestore) return;
    setIsSubmitting(true);
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { assignedDepartments: selectedDepartments });

    const deptNames = selectedDepartments.map(id => allDepartments.find(d => d.id === id)?.name).filter(Boolean).join(', ');
    addTimelineEvent(deptNames ? `Assigned to: ${deptNames}`: 'All departments unassigned');

    toast({
      title: 'Departments Reassigned',
      description: 'The assigned departments have been updated.',
    });
    setIsSubmitting(false);
    setIsDeptDialogOpen(false);
  };
  
  const departmentOptions = allDepartments.map(dept => ({
    value: dept.id,
    label: dept.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button>Update Status</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Report Status</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Select onValueChange={(value: ReportStatus) => setStatus(value)} defaultValue={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="For Review">For Review</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleStatusUpdate} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeptDialogOpen} onOpenChange={setIsDeptDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Reassign Departments</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Departments</DialogTitle>
              <DialogDescription>Select the departments to assign to this report.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <MultiSelect
                    options={departmentOptions}
                    selected={selectedDepartments}
                    onChange={setSelectedDepartments}
                    className="w-full"
                    placeholder="Select departments..."
                />
            </div>
            <DialogFooter>
              <Button onClick={handleDepartmentUpdate} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
