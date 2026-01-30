'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TabletSmartphone, Activity, HardDrive } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import { useFirestore } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where } from "firebase/firestore";
import type { UserProfile, Device } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
    const firestore = useFirestore();

    const { data: patients, loading: loadingPatients } = useCollection<UserProfile>(
        query(collection(firestore, 'users'), where('role', '==', 'patient'))
    );
    const { data: doctors, loading: loadingDoctors } = useCollection<UserProfile>(
        query(collection(firestore, 'users'), where('role', '==', 'doctor'))
    );
    const { data: devices, loading: loadingDevices } = useCollection<Device>(
        query(collection(firestore, 'devices'))
    );

    const activeDevices = devices?.filter(d => d.status === 'Active').length || 0;

    const summaryCards = [
        {
        title: "Total Patients",
        value: patients?.length || 0,
        icon: <Users className="h-6 w-6 text-muted-foreground" />,
        loading: loadingPatients,
        },
        {
        title: "Active Doctors",
        value: doctors?.length || 0,
        icon: <Users className="h-6 w-6 text-muted-foreground" />,
        loading: loadingDoctors,
        },
        {
        title: "Devices Online",
        value: activeDevices,
        icon: <TabletSmartphone className="h-6 w-6 text-muted-foreground" />,
        loading: loadingDevices,
        },
        {
        title: "System Health",
        value: "Good",
        icon: <HardDrive className="h-6 w-6 text-green-500" />,
        loading: false,
        },
  ];


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">System Overview</h1>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        {card.loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{card.value}</div>}
                    </CardContent>
                </Card>
            ))}
        </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Program Metrics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground">Patients Enrolled</p>
                    <p className="font-semibold text-lg">{patients?.length || 0}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Emergency Preventions</p>
                    <p className="font-semibold text-lg">18</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Alert Response Rate</p>
                    <p className="font-semibold text-lg">94%</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Data Capture Rate</p>
                    <p className="font-semibold text-lg">98.5%</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">System Uptime</p>
                    <p className="font-semibold text-lg">99.95%</p>
                </div>
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <CardTitle>Device Management</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Total Devices</p>
                    <p className="font-semibold text-lg">{devices?.length || 0}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Active</p>
                    <p className="font-semibold text-lg">{activeDevices} ({devices && devices.length > 0 ? Math.round((activeDevices / devices.length) * 100) : 0}%)</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Low Battery</p>
                    <p className="font-semibold text-lg text-yellow-600">23</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Connection Issues</p>
                    <p className="font-semibold text-lg text-destructive">5</p>
                </div>
                <div className="col-span-2">
                    <Button asChild variant="secondary" className="w-full mt-2"><Link href="/admin/devices">View Device Status →</Link></Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
