import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { alerts, patients } from "@/lib/data";
import { Users, AlertTriangle, Bell, Activity, Phone, Check, MessageSquare } from "lucide-react";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Doctor Portal | VitalWatch',
  description: 'Your central hub for patient monitoring, alerts, and quick actions.',
};

export default function DoctorDashboard() {
  const unreadAlerts = alerts.filter(a => !a.isRead);
  const criticalPatients = patients.filter(p => p.status === 'Critical');
  const criticalAndHighAlerts = alerts.filter(a => (a.severity === 'Critical' || a.severity === 'High') && !a.isRead);

  const summaryCards = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Active Alerts",
      value: unreadAlerts.length,
      icon: <Bell className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Critical Risk",
      value: criticalPatients.length,
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
    },
    {
      title: "Readings Today",
      value: "14,610",
      icon: <Activity className="h-6 w-6 text-muted-foreground" />,
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

        <Card>
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Critical Alerts (Requires Immediate Attention)</CardTitle>
                <CardDescription>Patients with vitals that have crossed critical thresholds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {criticalAndHighAlerts.length > 0 ? (
                    criticalAndHighAlerts.slice(0, 2).map(alert => (
                        <div key={alert.id} className="p-4 border rounded-lg flex flex-wrap items-center justify-between gap-4 bg-destructive/10 border-destructive/20">
                            <div className="flex-1 min-w-[200px]">
                                <p className="font-bold">{alert.patientName}</p>
                                <p className="text-sm"><span className="text-destructive font-semibold">{alert.message}</span> at {alert.timestamp}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button size="sm" asChild><Link href={`/doctor/patients/${alert.patientId}`}><Users className="mr-2"/> View Details</Link></Button>
                                <Button size="sm" variant="outline"><Phone className="mr-2"/> Call Patient</Button>
                                <Button size="sm" variant="ghost"><Check className="mr-2"/> Acknowledge</Button>
                            </div>
                        </div>
                    ))
                 ) : (
                    <p className="text-sm text-muted-foreground">No critical alerts at this time.</p>
                 )}
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Patient Quick View</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Glucose</TableHead>
                            <TableHead>BP</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.slice(0,4).map(p => {
                                const latestVitals = p.vitals[p.vitals.length-1];
                                return (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>
                                        <span className={latestVitals['Glucose'] > 180 ? 'text-destructive font-bold' : ''}>
                                            {latestVitals['Glucose']}
                                        </span>
                                    </TableCell>
                                    <TableCell>{`${latestVitals['Systolic']}/${latestVitals['Diastolic']}`}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'Critical' ? 'destructive' : p.status === 'Needs Review' ? 'secondary' : 'default'} className={p.status === 'Stable' ? 'bg-green-500 hover:bg-green-500/80' : ''}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button asChild variant="link" size="sm"><Link href={`/doctor/patients/${p.id}`}>View</Link></Button>
                                    </TableCell>
                                </TableRow>
                            )})
                            }
                        </TableBody>
                    </Table>
                     <Button variant="secondary" className="mt-4 w-full" asChild><Link href="/doctor/patients">View All Patients</Link></Button>
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Notifications</CardTitle>
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/doctor/alerts">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {alerts.filter(a => !a.isRead).slice(0, 3).map(alert => (
                            <div key={alert.id} className="flex items-start gap-3">
                                <div className="flex-shrink-0 pt-1">
                                    <Bell className={`h-4 w-4 ${alert.severity === 'Critical' || alert.severity === 'High' ? 'text-destructive' : 'text-yellow-500'}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-tight">{alert.patientName}: {alert.message}</p>
                                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                                </div>
                            </div>
                        ))}
                         <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 pt-1">
                                    <MessageSquare className={`h-4 w-4 text-blue-500`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-tight">Ramaiah S. acknowledged taking medication</p>
                                    <p className="text-xs text-muted-foreground">45m ago</p>
                                </div>
                            </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
