import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, patients, alerts } from "@/lib/data";
import { Users, AlertTriangle, Bell } from "lucide-react";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DoctorDashboard() {
  const criticalPatients = patients.filter(p => p.status === 'Critical').length;
  const needsReviewPatients = patients.filter(p => p.status === 'Needs Review').length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const summaryCards = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Active Alerts",
      value: unreadAlerts,
      icon: <Bell className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Critical Status",
      value: criticalPatients,
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Needs Review",
      value: needsReviewPatients,
      icon: <Users className="h-6 w-6 text-yellow-500" />,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Overall Patient Vitals Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={patients[0].vitals} />
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Alerts</CardTitle>
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/doctor/alerts">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {alerts.slice(0, 4).map(alert => (
                            <div key={alert.id} className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className={`h-5 w-5 ${alert.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                                </div>
                                <div>
                                    <p className="font-medium">{alert.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
