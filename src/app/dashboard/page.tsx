
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ReportsTable } from '@/components/dashboard/reports-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListPlus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { AdminNote, Department, Report } from '@/lib/types';
import { MonthlySummary } from '@/components/dashboard/monthly-summary';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

function AdminNotes() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    const adminNotesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'admin_notes');
    }, [firestore, user]);

    const { data: notes, isLoading: areNotesLoading } = useCollection<AdminNote>(adminNotesQuery);

    const isLoading = isUserLoading || areNotesLoading;

    const handleAddNote = async () => {
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (!title.trim() || !content.trim()) {
             toast({ variant: 'destructive', title: 'Error', description: 'Title and content cannot be empty.' });
            return;
        }

        setIsSubmitting(true);

        const newNote = {
            title,
            content,
            authorId: user.uid,
            timestamp: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            if (adminNotesQuery) {
                await addDocumentNonBlocking(adminNotesQuery, newNote);
                toast({ title: 'Note Added', description: 'Your note has been successfully saved.' });
                setTitle('');
                setContent('');
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Failed to add note', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Admin Notes</CardTitle>
                        <CardDescription>Live notes for all administrators.</CardDescription>
                    </div>
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ListPlus className="h-4 w-4 mr-2" />
                                Add Note
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Admin Note</DialogTitle>
                                <DialogDescription>
                                    This note will be visible to all administrators.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input 
                                        id="title" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Note title"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Type your note content here."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddNote} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Note
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {isLoading && <p>Loading notes...</p>}
                    {!isLoading && notes && notes.length > 0 ? (
                        [...notes].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(note => (
                         <div key={note.id} className="flex flex-col p-3 bg-secondary/50 rounded-lg">
                            <span className="font-semibold text-sm">{note.title}</span>
                            <p className="text-sm text-muted-foreground">{note.content}</p>
                            <span className="text-xs text-muted-foreground mt-2">{note.authorId} - {format(new Date(note.timestamp), 'MMM d, yyyy')}</span>
                        </div>
                    ))) : (
                     !isLoading && <p className="text-sm text-muted-foreground text-center">No admin notes found.</p>
                     )}
                </div>
            </CardContent>
        </Card>
    );
}


export default function DashboardPage() {
  const firestore = useFirestore();
  const reportsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'reports') : null, [firestore]);
  const { data: reports, isLoading: areReportsLoading } = useCollection<Report>(reportsQuery);
  const departmentsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'departments') : null, [firestore]);
  const { data: departments, isLoading: areDepartmentsLoading } = useCollection<Department>(departmentsQuery);

  const isLoading = areReportsLoading || areDepartmentsLoading;


  return (
    <div className="flex flex-col gap-4">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>An overview of all submitted incident reports.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <p>Loading reports...</p>}
                {reports && <ReportsTable data={reports} />}
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
            <MonthlySummary 
              reports={reports || []} 
              departments={departments || []}
              isLoading={isLoading} 
            />
            <AdminNotes />
        </div>
      </div>
    </div>
  );
}
