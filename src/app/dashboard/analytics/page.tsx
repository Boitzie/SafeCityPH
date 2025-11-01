
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div>
      <h3 className="text-lg font-medium">Analytics</h3>
      <p className="text-sm text-muted-foreground">
        View analytics for your reports.
      </p>
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Analytics page is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">This page will contain charts and graphs for report analytics.</p>
        </CardContent>
      </Card>
    </div>
  );
}
