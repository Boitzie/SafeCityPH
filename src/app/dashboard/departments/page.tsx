
import { getDepartments } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronLeft } from 'lucide-react';
import { DepartmentsTable } from '@/components/dashboard/departments-table';
import Link from 'next/link';

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h3 className="text-lg font-medium">Departments</h3>
                <p className="text-sm text-muted-foreground">
                    Manage assignable departments for incident reports.
                </p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Department
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Department List</CardTitle>
                <CardDescription>An overview of all available departments.</CardDescription>
            </CardHeader>
            <CardContent>
                <DepartmentsTable data={departments} />
            </CardContent>
        </Card>
    </div>
  );
}
