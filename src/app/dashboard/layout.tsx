import { Bell, Home, LineChart, Package, Settings, Shield, Users, FileCheck2, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/dashboard/user-nav";
import { mockReports } from "@/lib/data";


function SidebarNavigation() {
    'use client';
    const pathname = usePathname();

    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };
    
    const statusCounts = mockReports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard', true)}>
                    <Link href="/dashboard">
                        <Home />
                        <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=For+Review')}>
                    <Link href="/dashboard?status=For+Review">
                        <FileCheck2 />
                        <span>Verify Reports</span>
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-700">
                           {statusCounts['For Review'] || 0}
                        </Badge>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=In+Progress')}>
                     <Link href="/dashboard?status=In+Progress">
                        <AlertTriangle />
                        <span>In Progress</span>
                         <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-700">
                           {statusCounts['In Progress'] || 0}
                        </Badge>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=Resolved')}>
                     <Link href="/dashboard?status=Resolved">
                        <ShieldCheck />
                        <span>Resolved</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/analytics')}>
                     <Link href="#">
                        <LineChart />
                        <span>Analytics</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <Sidebar>
                    <SidebarHeader className="p-4">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                            <Icons.logo className="h-7 w-7" />
                            <span className="text-lg">Makati Guardian</span>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                       <SidebarNavigation />
                    </SidebarContent>
                    <SidebarFooter className="p-4">
                       <Card>
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Connection Status</CardTitle>
                                <CardDescription>
                                    You are currently online and all data is syncing in real-time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Badge className="bg-green-500/20 text-green-700 border-none">
                                    Online
                                </Badge>
                            </CardContent>
                        </Card>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                         <SidebarTrigger className="sm:hidden"/>
                        <div className="ml-auto flex items-center gap-4">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">Toggle notifications</span>
                            </Button>
                            <UserNav />
                        </div>
                    </header>
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
