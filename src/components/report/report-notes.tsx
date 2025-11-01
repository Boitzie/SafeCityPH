'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Report, Note } from '@/lib/types';
import { updateDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReportNotesProps {
  report: Report;
}

export function ReportNotes({ report }: ReportNotesProps) {
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!noteText.trim() || !firestore || !user) return;
    setIsSubmitting(true);
    
    const newNote: Note = {
      id: new Date().toISOString(), // Simple unique ID
      text: noteText,
      author: user.displayName || 'Admin',
      authorId: user.uid,
      timestamp: new Date().toISOString(),
    };
    
    const updatedNotes = [...(report.notes || []), newNote];
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { notes: updatedNotes });
    
    toast({ title: 'Note Added' });
    setNoteText('');
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
  };
  
  const handleEditNote = () => {
    if (!editingNote || !editingNote.text.trim() || !firestore || !user) return;
    if(editingNote.authorId !== user.uid) {
        toast({ variant: 'destructive', title: 'Error', description: "You can only edit your own notes."});
        return;
    }

    setIsSubmitting(true);
    const updatedNotes = (report.notes || []).map(n => n.id === editingNote.id ? editingNote : n);
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { notes: updatedNotes });

    toast({ title: 'Note Updated' });
    setEditingNote(null);
    setIsSubmitting(false);
    setIsEditDialogOpen(false);
  };

  const handleDeleteNote = () => {
    if (!noteToDelete || !firestore || !user) return;
    if(noteToDelete.authorId !== user.uid) {
        toast({ variant: 'destructive', title: 'Error', description: "You can only delete your own notes."});
        return;
    }
    
    setIsSubmitting(true);
    const updatedNotes = (report.notes || []).filter(n => n.id !== noteToDelete.id);
    const reportRef = doc(firestore, 'reports', report.id);
    updateDocumentNonBlocking(reportRef, { notes: updatedNotes });

    toast({ title: 'Note Deleted' });
    setNoteToDelete(null);
    setIsSubmitting(false);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (note: Note) => {
    if (user && note.authorId === user.uid) {
      setEditingNote(note);
      setIsEditDialogOpen(true);
    } else {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can only edit your own notes.' });
    }
  };

  const openDeleteDialog = (note: Note) => {
    if (user && note.authorId === user.uid) {
        setNoteToDelete(note);
        setIsDeleteDialogOpen(true);
    } else {
        toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can only delete your own notes.' });
    }
  };


  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle>Notes</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><PlusCircle className='h-4 w-4 mr-2' /> Add Note</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new note</DialogTitle>
                </DialogHeader>
                <Textarea
                    placeholder="Type your note here."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    disabled={isSubmitting}
                />
                <DialogFooter>
                    <Button onClick={handleAddNote} disabled={!noteText.trim() || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.notes && report.notes.length > 0 ? (
          [...report.notes].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((note) => (
            <div key={note.id} className="bg-secondary/50 p-3 rounded-md group">
              <p className="text-sm">"{note.text}"</p>
              <div className='flex justify-between items-end'>
                <p className="text-xs text-muted-foreground mt-2">
                  - {note.author}, {format(new Date(note.timestamp), 'P p')}
                </p>
                {user && user.uid === note.authorId && (
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity flex gap-1'>
                        <Button variant="ghost" size="icon" className='h-7 w-7' onClick={() => openEditDialog(note)}>
                            <Edit className='h-4 w-4'/>
                        </Button>
                        <Button variant="ghost" size="icon" className='h-7 w-7 hover:bg-destructive/10 hover:text-destructive' onClick={() => openDeleteDialog(note)}>
                            <Trash2 className='h-4 w-4'/>
                        </Button>
                    </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No notes for this report yet.</p>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editingNote?.text || ''}
            onChange={(e) => setEditingNote(prev => prev ? {...prev, text: e.target.value} : null)}
            disabled={isSubmitting}
          />
          <DialogFooter>
            <Button onClick={handleEditNote} disabled={!editingNote?.text.trim() || isSubmitting}>
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
              This action cannot be undone. This will permanently delete the note from the report.
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

    </Card>
  );
}
