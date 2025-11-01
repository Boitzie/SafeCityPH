
import { Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <Sidebar className="hidden md:block">
                    <SidebarHeader className="p-4">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                            <Image src="/logo.svg" alt="SafeCityPH Logo" width={28} height={28} />
                            <span className="text-lg">SafeCityPH</span>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                       <SidebarNavigation />
                    </SidebarContent>
                </Sidebar>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                         <SidebarTrigger className="sm:hidden"/>
                        <div className="w-full flex-1">
                           {/* Add search bar here if needed */}
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                        <UserNav />
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
