
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Send, Percent, Clock, FileText, CheckCircle, Loader2 } from 'lucide-react';
import type { Report, TimelineEvent, Department } from '@/lib/types';
import { parseISO, differenceInMinutes, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateActivityLog } from '@/ai/flows/generate-activity-log';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MonthlySummaryProps {
    reports: Report[];
    departments: Department[];
    isLoading: boolean;
}

export function MonthlySummary({ reports, departments, isLoading }: MonthlySummaryProps) {
    const { toast } = useToast();
    const [isGeneratingLog, setIsGeneratingLog] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

    // Set a fixed date for October 2025 to match the seed data
    const [targetDate] = useState(new Date('2025-10-01T00:00:00'));

    const TARGET_YEAR = targetDate.getFullYear();
    const TARGET_MONTH = targetDate.getMonth();

    const monthlyStats = useMemo(() => {
        if (!reports || reports.length === 0) {
            return {
                monthlyReports: [] as Report[],
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
            return { monthlyReports, totalReports: 0, resolvedCases: 0, completionRate: 0, avgResponseTime: 0 };
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
            monthlyReports,
            totalReports,
            resolvedCases,
            completionRate: Math.round(completionRate),
            avgResponseTime: Math.round(avgResponseTime),
        };
    }, [reports, TARGET_YEAR, TARGET_MONTH]);
    
    const formattedMonth = format(targetDate, 'MMMM yyyy');

    const handleDownloadLog = async () => {
        setIsGeneratingLog(true);
        try {
            if (monthlyStats.monthlyReports.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'No Data',
                    description: 'There is no activity to generate a log for.',
                });
                return;
            }

            const timelines = monthlyStats.monthlyReports.flatMap(r => r.timeline || []);
            const result = await generateActivityLog({
                month: formattedMonth,
                timeline: timelines,
            });

            const blob = new Blob([result.log], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `SafeCityPH_ActivityLog_${formattedMonth.replace(' ', '_')}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: 'Log Generated',
                description: 'Your activity log has been downloaded.',
            });

        } catch (error) {
            console.error('Failed to generate activity log:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'The AI could not generate the activity log.',
            });
        } finally {
            setIsGeneratingLog(false);
        }
    };

    const handleSendReport = () => {
        if (!selectedDepartment) {
            toast({
                variant: 'destructive',
                title: 'No Department Selected',
                description: 'Please select a department to send the report to.',
            });
            return;
        }

        setIsSending(true);

        // Simulate sending process
        setTimeout(() => {
            setIsSending(false);
            setIsSendDialogOpen(false);
            toast({
                title: 'Report Sent',
                description: `The monthly summary has been sent to the ${departments.find(d => d.id === selectedDepartment)?.name}.`,
            });
        }, 1500);
    };

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
                    <Button variant="outline" onClick={handleDownloadLog} disabled={isGeneratingLog}>
                        {isGeneratingLog ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                        ) : (
                            <><FileDown className="mr-2 h-4 w-4" />Download Responder Activity Log</>
                        )}
                    </Button>
                    <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Send className="mr-2 h-4 w-4" />
                                Send to Concerned Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Monthly Summary</DialogTitle>
                                <DialogDescription>
                                    Select a department to send the {formattedMonth} report summary to.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                               <Select onValueChange={setSelectedDepartment} defaultValue={selectedDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Summary Preview</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <p><strong>Month:</strong> {formattedMonth}</p>
                                        <p><strong>Total Reports:</strong> {monthlyStats.totalReports}</p>
                                        <p><strong>Resolved Cases:</strong> {monthlyStats.resolvedCases}</p>
                                        <p><strong>Completion Rate:</strong> {monthlyStats.completionRate}%</p>
                                        <p><strong>Avg. Response Time:</strong> {monthlyStats.avgResponseTime} min</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSendReport} disabled={isSending || !selectedDepartment}>
                                    {isSending ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                                    ) : (
                                        'Send Report'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
