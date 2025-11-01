
import { getDepartments } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DepartmentsTable } from '@/components/dashboard/departments-table';

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
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
