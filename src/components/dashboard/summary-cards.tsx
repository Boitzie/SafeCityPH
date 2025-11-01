'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, FileCheck2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Report, ReportStatus } from '@/lib/types';

export function SummaryCards() {
  const firestore = useFirestore();
  const reportsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'reports') : null, [firestore]);
  const { data: reports, isLoading } = useCollection<Report>(reportsQuery);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
        </div>
    )
  }

  const totalReports = reports?.length || 0;
  const statusCounts = reports?.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<ReportStatus, number>) || {};

  const inProgress = statusCounts['In Progress'] || 0;
  const forReview = statusCounts['For Review'] || 0;
  const resolved = statusCounts['Resolved'] || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <File className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <p className="text-xs text-muted-foreground">All incidents recorded</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgress}</div>
          <p className="text-xs text-muted-foreground">Currently active incidents</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">For Review</CardTitle>
          <FileCheck2 className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{forReview}</div>
          <p className="text-xs text-muted-foreground">New reports awaiting validation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolved}</div>
          <p className="text-xs text-muted-foreground">Closed and resolved incidents</p>
        </CardContent>
      </Card>
    </div>
  );
}
