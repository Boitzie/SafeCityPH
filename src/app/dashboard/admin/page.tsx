
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { reportSeedData } from '@/lib/seed-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedDatabase = async () => {
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Firestore is not available.',
            });
            return;
        }

        setIsSeeding(true);
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
                    assignedDepartments: [],
                    notes: [],
                    images: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    // ensure all fields from the type are present
                    reporterName: reportData.submittedBy,
                    reporterContact: reportData.contactNumber,
                    dateTime: reportData.submittedAt,
                    urgency: reportData.urgency || 'Medium',
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
            setIsSeeding(false);
        }
    };
    
    if (isUserLoading) {
        return <p>Loading...</p>;
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
                        Import initial incident reports into the Firestore database. This action will create 9 new report documents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            'Seed Incident Reports'
                        )}
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2">
                        Note: Running this multiple times will overwrite existing reports with the same ID.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
