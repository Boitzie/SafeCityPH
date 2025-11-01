'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, User, MapPin, Phone } from 'lucide-react';
import type { Report } from '@/lib/types';
import { extractResponderInfo, type ExtractInfoOutput } from '@/ai/flows/extract-responder-info';
import { useToast } from '@/hooks/use-toast';

interface ResponderInfoProps {
    report: Report;
}

export function ResponderInfo({ report }: ResponderInfoProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [extractedInfo, setExtractedInfo] = useState<ExtractInfoOutput | null>(null);
    const { toast } = useToast();

    const handleExtractInfo = async () => {
        setIsLoading(true);
        setExtractedInfo(null);
        try {
            const result = await extractResponderInfo({ description: report.description });
            setExtractedInfo(result);
        } catch (error) {
            console.error("Failed to extract info:", error);
            toast({
                variant: 'destructive',
                title: 'Extraction Failed',
                description: 'The AI could not extract the required information from the report.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Responder Info</CardTitle>
                <CardDescription>AI-extracted details for quick response.</CardDescription>
            </CardHeader>
            <CardContent>
                {extractedInfo ? (
                     <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <span className="font-semibold">Reporter:</span>
                                <p>{extractedInfo.reporterName || 'Not found'}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <span className="font-semibold">Contact:</span>
                                <p>{extractedInfo.reporterContact || 'Not found'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                             <div>
                                <span className="font-semibold">Location:</span>
                                <p>{extractedInfo.location || 'Not found'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button onClick={handleExtractInfo} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Extracting...
                            </>
                        ) : (
                             <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Extract Details
                            </>
                        )}
                    </Button>
                )}
                 {extractedInfo && (
                     <Button variant="secondary" size="sm" onClick={() => setExtractedInfo(null)} className="w-full mt-4">
                        Clear
                    </Button>
                 )}
            </CardContent>
        </Card>
    );
}
