
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Send, Percent, Clock, FileText, CheckCircle } from 'lucide-react';
import type { Report, TimelineEvent } from '@/lib/types';
import { parseISO, differenceInMinutes, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface MonthlySummaryProps {
    reports: Report[];
    isLoading: boolean;
}

const TARGET_YEAR = 2025;
const TARGET_MONTH = 8; // 0-indexed for September

export function MonthlySummary({ reports, isLoading }: MonthlySummaryProps) {
    const { toast } = useToast();

    const monthlyStats = useMemo(() => {
        if (!reports || reports.length === 0) {
            return {
                totalReports: 0,
                resolvedCases: 0,
                completionRate: 0,
                avgResponseTime: 0,
            };
        }

        const monthlyReports = reports.filter(report => {
            const reportDate = parseISO(report.dateTime);
            return reportDate.getFullYear() === TARGET_YEAR && reportDate.getMonth() === TARGET_MONTH;
        });

        const totalReports = monthlyReports.length;
        if (totalReports === 0) {
            return { totalReports: 0, resolvedCases: 0, completionRate: 0, avgResponseTime: 0 };
        }

        const resolvedCases = monthlyReports.filter(r => r.status === 'Resolved').length;
        const completionRate = totalReports > 0 ? (resolvedCases / totalReports) * 100 : 0;

        let totalResponseMinutes = 0;
        let reportsWithResponseTime = 0;

        monthlyReports.forEach(report => {
            const submissionTime = parseISO(report.dateTime);
            const responseEvent = report.timeline?.find(
                (e: TimelineEvent) => e.event.includes('dispatched') || e.event.includes('on site')
            );

            if (responseEvent) {
                const responseTime = parseISO(responseEvent.time);
                const diff = differenceInMinutes(responseTime, submissionTime);
                if (diff >= 0) {
                    totalResponseMinutes += diff;
                    reportsWithResponseTime++;
                }
            }
        });

        const avgResponseTime = reportsWithResponseTime > 0
            ? totalResponseMinutes / reportsWithResponseTime
            : 0;

        return {
            totalReports,
            resolvedCases,
            completionRate: Math.round(completionRate),
            avgResponseTime: Math.round(avgResponseTime),
        };
    }, [reports]);

    const handleNotImplemented = () => {
        toast({
            title: 'Feature Not Implemented',
            description: 'This functionality will be available in a future update.',
        });
    };
    
    const formattedMonth = format(new Date(TARGET_YEAR, TARGET_MONTH), 'MMMM yyyy');

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                           <Card key={i}>
                               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <Skeleton className="h-5 w-2/3" />
                                   <Skeleton className="h-4 w-4" />
                               </CardHeader>
                               <CardContent>
                                   <Skeleton className="h-7 w-1/3" />
                                   <Skeleton className="h-3 w-full mt-1" />
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Skeleton className="h-10 w-full sm:w-1/2" />
                        <Skeleton className="h-10 w-full sm:w-1/2" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Report Summary: {formattedMonth}</CardTitle>
                <CardDescription>An overview of incident report analytics for the selected month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyStats.totalReports}</div>
                             <p className="text-xs text-muted-foreground">Total incidents recorded</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyStats.resolvedCases}</div>
                             <p className="text-xs text-muted-foreground">Reports closed this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyStats.completionRate}%</div>
                            <p className="text-xs text-muted-foreground">Of reports resolved</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyStats.avgResponseTime} <span className="text-lg">min</span></div>
                             <p className="text-xs text-muted-foreground">From submission to dispatch</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={handleNotImplemented}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Responder Activity Log
                    </Button>
                    <Button onClick={handleNotImplemented}>
                        <Send className="mr-2 h-4 w-4" />
                        Send to Concerned Department
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
