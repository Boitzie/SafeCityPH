'use client';

import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { format } from 'date-fns';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  Tag,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import { UrgencyBadge } from '@/components/urgency-badge';
import { Timeline } from '@/components/report/timeline';
import type { Report, Department } from '@/lib/types';
import { useMemo } from 'react';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const reportRef = useMemo(() => firestore ? doc(firestore, 'reports', params.id) : null, [firestore, params.id]);
  const { data: report, isLoading: isReportLoading } = useDoc<Report>(reportRef);

  const departmentsQuery = useMemo(() => firestore ? collection(firestore, 'departments') : null, [firestore]);
  const { data: departments, isLoading: areDepartmentsLoading } = useCollection<Department>(departmentsQuery);

  if (isReportLoading || areDepartmentsLoading) {
    return <div>Loading...</div>;
  }

  if (!report) {
    return notFound();
  }

  const assignedDeptNames = departments
    ?.filter(dept => report.assignedDepartments.includes(dept.id))
    .map(dept => dept.name) || [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
                <div>
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                  <CardDescription>{report.reportId}</CardDescription>
                </div>
                <div className='flex gap-2 shrink-0'>
                    <UrgencyBadge urgency={report.urgency} />
                    <StatusBadge status={report.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{report.description}</p>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(report.dateTime), 'PPpp')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{report.reporterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{report.reporterContact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>{report.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Timeline report={report} />
        </div>

        <div className="lg:col-span-1 grid gap-4 auto-rows-max">
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-2'>
                    <Button>Update Status</Button>
                    <Button variant="outline">Reassign Departments</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Departments</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {assignedDeptNames.map((name, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Users className="h-4 w-4"/>
                                {name}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
           {report.images.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle>Attached Images</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                   {report.images.map((src, index) => (
                       <div key={index} className="relative aspect-video">
                           <Image
                                src={src}
                                alt={`Report image ${index + 1}`}
                                fill
                                className="rounded-md object-cover"
                            />
                       </div>
                   ))}
                </CardContent>
            </Card>
           )}
           {report.notes.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {report.notes.map((note, index) => (
                        <div key={index} className="bg-secondary/50 p-3 rounded-md">
                            <p className="text-sm">"{note.text}"</p>
                            <p className="text-xs text-muted-foreground mt-2">- {note.author}, {format(new Date(note.timestamp), 'P')}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
           )}
        </div>
      </div>
    </div>
  );
}
