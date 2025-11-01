
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Report } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
import { LabelList } from 'recharts';
import { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

const STATUS_COLORS = {
  'For Review': 'hsl(var(--chart-3))',
  'In Progress': 'hsl(var(--chart-2))',
  'Resolved': 'hsl(var(--chart-1))',
};

const URGENCY_COLORS = {
  'High': 'hsl(var(--chart-1))',
  'Medium': 'hsl(var(--chart-2))',
  'Low': 'hsl(var(--chart-5))',
};


export default function AnalyticsPage() {
  const firestore = useFirestore();
  const reportsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'reports') : null, [firestore]);
  const { data: reports, isLoading } = useCollection<Report>(reportsQuery);

  const reportsByStatus = useMemo(() => {
    if (!reports) return [];
    const counts = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([status, count]) => ({ status, count, fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }));
  }, [reports]);

  const reportsByCategory = useMemo(() => {
    if (!reports) return [];
    const counts = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [reports]);

  const reportsByUrgency = useMemo(() => {
    if (!reports) return [];
    const counts = reports.reduce((acc, report) => {
      acc[report.urgency] = (acc[report.urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
     return Object.entries(counts).map(([urgency, count]) => ({
      urgency,
      count,
      fill: URGENCY_COLORS[urgency as keyof typeof URGENCY_COLORS],
    }));
  }, [reports]);
  
  const reportsByMonth = useMemo(() => {
    if (!reports) return [];
    const counts = reports.reduce((acc, report) => {
      const month = format(parseISO(report.dateTime), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  }, [reports]);


  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading analytics...</p></div>;
  }
  
  const totalReports = reports?.length || 0;

  return (
    <div className="space-y-6">
        <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="text-sm text-muted-foreground">
                An overview of incident report data.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Reports by Status</CardTitle>
                    <CardDescription>Distribution of reports across different statuses.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={reportsByStatus}
                                dataKey="count"
                                nameKey="status"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <LabelList
                                    dataKey="status"
                                    className="fill-background"
                                    stroke="none"
                                    fontSize={12}
                                    formatter={(value: string) =>
                                       reportsByStatus.find((d) => d.status === value)?.count
                                    }
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Reports by Urgency</CardTitle>
                    <CardDescription>Breakdown of reports by their urgency level.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel nameKey="urgency" />}
                            />
                            <Pie
                                data={reportsByUrgency}
                                dataKey="count"
                                nameKey="urgency"
                                outerRadius={80}
                                >
                                {reportsByUrgency.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                <LabelList
                                    dataKey="count"
                                    className="fill-foreground"
                                    stroke="none"
                                    fontSize={12}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Total Reports</CardTitle>
                     <CardDescription>A summary of all incident reports recorded.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                    <div className="text-center">
                        <p className="text-6xl font-bold">{totalReports}</p>
                        <p className="text-muted-foreground">Total Reports</p>
                    </div>
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
                <CardDescription>Total number of reports filed under each category.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ count: { label: "Reports" } }} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={reportsByCategory} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-primary)" radius={4}>
                             <LabelList
                                position="top"
                                offset={10}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Monthly Reports</CardTitle>
                <CardDescription>Total reports submitted per month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ count: { label: "Reports" } }} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={reportsByMonth} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-primary)" radius={4}>
                             <LabelList
                                position="top"
                                offset={10}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
