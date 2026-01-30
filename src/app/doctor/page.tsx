'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, Bell, Activity, Phone, Check, MessageSquare } from "lucide-react";
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
import { useFirestore } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where, limit, orderBy } from "firebase/firestore";
import type { Patient, Alert } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


export default function DoctorDashboard() {
  const firestore = useFirestore();

  const { data: patients, loading: loadingPatients } = useCollection<Patient>(
    query(collection(firestore, 'patients'), limit(10))
  );

  const { data: alerts, loading: loadingAlerts } = useCollection<Alert>(
    query(collection(firestore, 'alerts'), where('isRead', '==', false), orderBy('timestamp', 'desc'), limit(5))
  );

  const { data: criticalAlerts, loading: loadingCriticalAlerts } = useCollection<Alert>(
      query(collection(firestore, 'alerts'), where('severity', 'in', ['Critical', 'High']), where('isRead', '==', false), limit(2))
  );
  
  const criticalPatients = patients?.filter(p => p.status === 'Critical') || [];

  const summaryCards = [
    {
      title: "Total Patients",
      value: patients?.length || 0,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Active Alerts",
      value: alerts?.length || 0,
      icon: <Bell className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Critical Risk",
      value: criticalPatients.length,
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
    },
    {
      title: "Readings Today",
      value: "14,610", // This would be a calculated value in a real app
      icon: <Activity className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  if (loadingPatients || loadingAlerts || loadingCriticalAlerts) {
    return (
         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
             <Skeleton className="h-48 w-full" />
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-80 w-full" />
                <Skeleton className="lg:col-span-3 h-80 w-full" />
             </div>
        </main>
    )
  }

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
                 {criticalAlerts && criticalAlerts.length > 0 ? (
                    criticalAlerts.map(alert => (
                        <div key={alert.id} className="p-4 border rounded-lg flex flex-wrap items-center justify-between gap-4 bg-destructive/10 border-destructive/20">
                            <div className="flex-1 min-w-[200px]">
                                <p className="font-bold">{alert.patientName}</p>
                                <p className="text-sm"><span className="text-destructive font-semibold">{alert.message}</span></p>
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
                            <TableHead>Risk</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients && patients.slice(0,4).map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'Critical' ? 'destructive' : p.status === 'Needs Review' ? 'secondary' : 'default'} className={p.status === 'Stable' ? 'bg-green-500 hover:bg-green-500/80' : ''}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell>{p.lastSeen}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="link" size="sm"><Link href={`/doctor/patients/${p.id}`}>View</Link></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                        {alerts && alerts.slice(0, 3).map(alert => (
                            <div key={alert.id} className="flex items-start gap-3">
                                <div className="flex-shrink-0 pt-1">
                                    <Bell className={`h-4 w-4 ${alert.severity === 'Critical' || alert.severity === 'High' ? 'text-destructive' : 'text-yellow-500'}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-tight">{alert.patientName}: {alert.message}</p>
                                    <p className="text-xs text-muted-foreground">{alert.timestamp.toDate().toLocaleTimeString()}</p>
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
