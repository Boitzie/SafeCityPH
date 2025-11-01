
'use client';

import { Home, FileCheck2, AlertTriangle, ShieldCheck, LineChart, Building, Database, Cog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Report } from "@/lib/types";

export function SidebarNavigation() {
    const pathname = usePathname();
    const firestore = useFirestore();

    const forReviewQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'reports'), where('status', '==', 'For Review')) : null, [firestore]);
    const { data: forReviewReports } = useCollection<Report>(forReviewQuery);

    const inProgressQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'reports'), where('status', '==', 'In Progress')) : null, [firestore]);
    const { data: inProgressReports } = useCollection<Report>(inProgressQuery);

    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
            return pathname === path;
        }
        if (path.includes("?")) {
            return pathname + (typeof window !== 'undefined' ? window.location.search : "") === path;
        }
        return pathname.startsWith(path);
    };

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
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                           {forReviewReports?.length || 0}
                        </Badge>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard?status=In Progress')}>
                     <Link href="/dashboard?status=In Progress">
                        <AlertTriangle />
                        <span>In Progress</span>
                         <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                           {inProgressReports?.length || 0}
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
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/admin')}>
                     <Link href="/dashboard/admin">
                        <Cog />
                        <span>Admin</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
