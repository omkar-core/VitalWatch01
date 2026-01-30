'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import { mockAlerts, mockPatients } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export default function PatientAlertsPage() {
  const patient = mockPatients[0]; // Use first mock patient
  const alerts = mockAlerts.filter(a => a.patientId === patient.uid);
  const loading = false;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Alerts & Advice</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-lg border border-dashed shadow-sm p-4">
        {alerts && alerts.length > 0 ? (
            alerts.map((item) => (
                <Card key={item.id}>
                    <CardHeader className="flex flex-row items-start gap-4">
                        {item.severity === 'Critical' || item.severity === 'High' ? <AlertTriangle className="h-6 w-6 text-yellow-500" /> : <Info className="h-6 w-6 text-primary" />}
                        <div>
                            <CardTitle>{item.severity} Alert</CardTitle>
                            <CardDescription>{item.timestamp?.toDate ? formatDistanceToNow(item.timestamp.toDate(), {addSuffix: true}) : ''}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{item.message}</p>
                    </CardContent>
                </Card>
            ))
        ) : (
             <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    No Alerts or Advice
                </h3>
                <p className="text-sm text-muted-foreground">
                    You have no new health alerts or advice from your care team.
                </p>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
