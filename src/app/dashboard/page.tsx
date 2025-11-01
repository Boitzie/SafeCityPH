'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ReportsTable } from '@/components/dashboard/reports-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListPlus, Loader2, Edit, Trash2 } from 'lucide-react';
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
    
    // State for Add dialog
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    
    // State for Edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<AdminNote | null>(null);

    // State for Delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<AdminNote | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const adminNotesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'admin_notes');
    }, [firestore]);

    const { data: notes, isLoading: areNotesLoading } = useCollection<AdminNote>(adminNotesQuery);

    const isLoading = isUserLoading || areNotesLoading;

    const handleAddNote = async () => {
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (!newTitle.trim() || !newContent.trim()) {
             toast({ variant: 'destructive', title: 'Error', description: 'Title and content cannot be empty.' });
            return;
        }

        setIsSubmitting(true);

        const newNote: Omit<AdminNote, 'id'> = {
            title: newTitle,
            content: newContent,
            authorId: user.uid,
            timestamp: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            if (adminNotesQuery) {
                await addDocumentNonBlocking(adminNotesQuery, newNote);
                toast({ title: 'Note Added', description: 'Your note has been successfully saved.' });
                setNewTitle('');
                setNewContent('');
                setIsAddDialogOpen(false);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Failed to add note', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEditNote = async () => {
        if (!firestore || !user || !editingNote) return;
        if (editingNote.authorId !== user.uid) {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can only edit your own notes.' });
            return;
        }

        setIsSubmitting(true);
        const noteRef = doc(firestore, 'admin_notes', editingNote.id);
        const updatedData = {
            title: editingNote.title,
            content: editingNote.content,
            updatedAt: new Date().toISOString(),
        };

        try {
            await updateDocumentNonBlocking(noteRef, updatedData);
            toast({ title: 'Note Updated', description: 'The note has been successfully updated.' });
            setIsEditDialogOpen(false);
            setEditingNote(null);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!firestore || !user || !noteToDelete) return;
         if (noteToDelete.authorId !== user.uid) {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can only delete your own notes.' });
            return;
        }

        setIsSubmitting(true);
        const noteRef = doc(firestore, 'admin_notes', noteToDelete.id);

        try {
            await deleteDocumentNonBlocking(noteRef);
            toast({ title: 'Note Deleted', description: 'The note has been permanently removed.' });
            setIsDeleteDialogOpen(false);
            setNoteToDelete(null);
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditDialog = (note: AdminNote) => {
        if (user && note.authorId === user.uid) {
            setEditingNote(note);
            setIsEditDialogOpen(true);
        } else {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'You cannot edit this note.' });
        }
    };

    const openDeleteDialog = (note: AdminNote) => {
        if (user && note.authorId === user.uid) {
            setNoteToDelete(note);
            setIsDeleteDialogOpen(true);
        } else {
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'You cannot delete this note.' });
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Admin Notes</CardTitle>
                            <CardDescription>Live notes for all administrators.</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Note title"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea
                                            id="content"
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
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
                            [...notes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(note => (
                                <div key={note.id} className="group relative flex flex-col p-3 bg-secondary/50 rounded-lg">
                                    <span className="font-semibold text-sm">{note.title}</span>
                                    <p className="text-sm text-muted-foreground">{note.content}</p>
                                    <span className="text-xs text-muted-foreground mt-2">{note.authorId} - {format(new Date(note.timestamp), 'MMM d, yyyy')}</span>

                                    {user && note.authorId === user.uid && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(note)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => openDeleteDialog(note)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            !isLoading && <p className="text-sm text-muted-foreground text-center">No admin notes found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin Note</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={editingNote?.title || ''}
                                onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                                placeholder="Note title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-content">Content</Label>
                            <Textarea
                                id="edit-content"
                                value={editingNote?.content || ''}
                                onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                                placeholder="Type your note content here."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">Cancel</Button>
                        <Button onClick={handleEditNote} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete this note.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteNote} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
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
