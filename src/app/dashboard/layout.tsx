
import { Bell, LineChart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
