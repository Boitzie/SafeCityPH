import { getReports, getAdminNotes } from '@/lib/data';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ReportsTable } from '@/components/dashboard/reports-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';
import { format } from 'date-fns';

async function AdminNotes() {
    const notes = await getAdminNotes();

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Admin Notes</CardTitle>
                        <CardDescription>Live notes for all administrators.</CardDescription>
                    </div>
                     <Button variant="outline" size="sm">
                        <ListPlus className="h-4 w-4 mr-2" />
                        Add Note
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notes.map(note => (
                         <div key={note.id} className="flex flex-col p-3 bg-secondary/50 rounded-lg">
                            <span className="font-semibold text-sm">{note.title}</span>
                            <p className="text-sm text-muted-foreground">{note.content}</p>
                            <span className="text-xs text-muted-foreground mt-2">{note.author} - {format(note.timestamp, 'MMM d, yyyy')}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


export default async function DashboardPage() {
  const reports = await getReports();

  return (
    <div className="flex flex-col gap-4">
      <SummaryCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>An overview of all submitted incident reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportsTable data={reports} />
          </CardContent>
        </Card>
        <div className="space-y-4">
            <AdminNotes />
        </div>
      </div>
    </div>
  );
}
