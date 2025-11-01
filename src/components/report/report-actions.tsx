
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Report, Department, ReportStatus } from '@/lib/types';
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const { toast } = useToast();

  useEffect(() => {
    setStatus(report.status);
    setSelectedDepartments(report.assignedDepartments || []);
  }, [report]);

  const handleStatusUpdate = () => {
    if (!firestore) return;
    setIsSubmitting(true);
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { status });
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
    toast({
      title: 'Departments Reassigned',
      description: 'The assigned departments have been updated.',
    });
    setIsSubmitting(false);
    setIsDeptDialogOpen(false);
  };
  
  const handleCheckboxChange = (deptId: string, checked: boolean) => {
    setSelectedDepartments(prev => 
      checked ? [...prev, deptId] : prev.filter(id => id !== deptId)
    );
  };

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
              {allDepartments.map(dept => (
                <div key={dept.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept.id}`}
                    checked={selectedDepartments.includes(dept.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(dept.id, !!checked)}
                  />
                  <Label htmlFor={`dept-${dept.id}`}>{dept.name}</Label>
                </div>
              ))}
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
