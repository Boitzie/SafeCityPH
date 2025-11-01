
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { reportSeedData } from '@/lib/seed-data';
import { departmentSeedData } from '@/lib/department-seed-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeedingReports, setIsSeedingReports] = useState(false);
    const [isSeedingDepts, setIsSeedingDepts] = useState(false);

    const handleSeedDatabase = async () => {
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Firestore is not available.',
            });
            return;
        }

        setIsSeedingReports(true);
        try {
            const batch = writeBatch(firestore);
            const reportsCollection = collection(firestore, 'reports');
            
            let count = 0;
            for (const reportData of reportSeedData) {
                const docId = reportData.reportId.replace('#', '');
                const docRef = doc(reportsCollection, docId);
                
                const sanitizedData = {
                    ...reportData,
                    id: docId,
                    assignedDepartments: reportData.assignedDepartments || [],
                    notes: reportData.notes || [],
                    images: reportData.images || [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                
                batch.set(docRef, sanitizedData);
                count++;
            }

            await batch.commit();

            toast({
                title: 'Database Seeded',
                description: `Successfully imported ${count} incident reports.`,
            });
        } catch (error: any) {
            console.error('Error seeding database:', error);
            toast({
                variant: 'destructive',
                title: 'Seeding Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsSeedingReports(false);
        }
    };

    const handleSeedDepartments = async () => {
         if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Firestore is not available.',
            });
            return;
        }

        setIsSeedingDepts(true);
        try {
            const batch = writeBatch(firestore);
            const deptsCollection = collection(firestore, 'departments');
            
            let count = 0;
            for (const deptData of departmentSeedData) {
                // Create a simple, URL-friendly ID from the name
                const docId = deptData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const docRef = doc(deptsCollection, docId);
                
                const sanitizedData = {
                    ...deptData,
                    id: docId,
                };
                
                batch.set(docRef, sanitizedData);
                count++;
            }

            await batch.commit();

            toast({
                title: 'Database Seeded',
                description: `Successfully imported ${count} departments.`,
            });
        } catch (error: any) {
            console.error('Error seeding departments:', error);
            toast({
                variant: 'destructive',
                title: 'Seeding Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsSeedingDepts(false);
        }
    };
    
    if (isUserLoading) {
        return <div className="flex h-screen w-full items-center justify-center"><p>Loading...</p></div>;
    }

    if (user?.email !== 'admin@scph.gov' && user?.email !== 'admin@gmail.scph.gov') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You do not have permission to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard" className="text-sm text-primary hover:underline">
                        Return to Dashboard
                    </Link>
                </CardContent>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
             <div>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h3 className="text-lg font-medium">Admin Tools</h3>
                <p className="text-sm text-muted-foreground">
                  System administration and data management.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Database Seeding</CardTitle>
                    <CardDescription>
                        Import initial data into the Firestore database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-start">
                    <div>
                        <Button onClick={handleSeedDatabase} disabled={isSeedingReports}>
                            {isSeedingReports ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importing Reports...
                                </>
                            ) : (
                                'Seed Incident Reports'
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            This will create or overwrite 9 sample incident reports.
                        </p>
                    </div>
                     <div>
                        <Button onClick={handleSeedDepartments} disabled={isSeedingDepts}>
                            {isSeedingDepts ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importing Departments...
                                </>
                            ) : (
                                'Seed Departments'
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                           This will create or overwrite the 5 official departments.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
