import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alerts & Advice - Patient Portal | VitalWatch',
  description: 'View important health alerts and advice from your care team.',
};

export default function PatientAlertsPage() {
  const alerts = [
      {
          type: "advice",
          title: "Maintain Fluid Intake",
          description: "Your recent vitals suggest you should ensure you're drinking plenty of water throughout the day.",
          timestamp: "1 day ago"
      },
      {
          type: "alert",
          title: "Slightly Elevated Heart Rate",
          description: "Your heart rate was slightly elevated this morning. Please monitor for any symptoms like dizziness or shortness of breath.",
          timestamp: "2 days ago"
      }
  ]
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Alerts & Advice</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-lg border border-dashed shadow-sm p-4">
        {alerts.length > 0 ? (
            alerts.map((item, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-start gap-4">
                        {item.type === 'alert' ? <AlertTriangle className="h-6 w-6 text-yellow-500" /> : <Info className="h-6 w-6 text-primary" />}
                        <div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>{item.timestamp}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{item.description}</p>
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
