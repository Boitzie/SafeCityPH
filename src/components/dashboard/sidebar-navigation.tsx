'use client';

import { Home, FileCheck2, AlertTriangle, ShieldCheck, LineChart, Building } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { mockReports } from "@/lib/data";

export function SidebarNavigation() {
    const pathname = usePathname();

    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
            return pathname === path;
        }
        if (path.includes("?")) {
            return pathname + (location.search || "") === path;
        }
        return pathname.startsWith(path);
    };
    
    const statusCounts = mockReports.reduce((acc, report) => {
        const status = report.status as keyof typeof acc;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { "For Review": 0, "In Progress": 0, "Resolved": 0 });

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
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=For Review')}>
                    <Link href="/dashboard?status=For Review">
                        <FileCheck2 />
                        <span>Verify Reports</span>
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-700">
                           {statusCounts['For Review'] || 0}
                        </Badge>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=In Progress')}>
                     <Link href="/dashboard?status=In Progress">
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
                <SidebarMenuButton asChild isActive={isActive('/dashboard/departments')}>
                        <Link href="/dashboard/departments">
                        <Building />
                        <span>Departments</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/analytics')}>
                     <Link href="/dashboard/analytics">
                        <LineChart />
                        <span>Analytics</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
