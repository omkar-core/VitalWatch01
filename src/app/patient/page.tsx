'use client';

import * as React from 'react';
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartPulse, Droplets, Calendar, MessageCircle, AlertTriangle, CheckCircle, Wifi, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { sendCommandToDevice } from '@/lib/device-commands';
import { useUser } from '@/firebase/auth/use-user';
import { collection, limit, onSnapshot, query, serverTimestamp, addDoc, orderBy } from 'firebase/firestore';
import type { Patient, Vital, Alert } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientPage() {
  const { user, userProfile, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const [vitals, setVitals] = React.useState<Vital[]>([]);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loadingVitals, setLoadingVitals] = React.useState(true);
  const [loadingAlerts, setLoadingAlerts] = React.useState(true);
  
  const latestVital = vitals.length > 0 ? vitals[0] : null;
  const activeAlert = alerts.length > 0 ? alerts[0] : null;

  React.useEffect(() => {
    if (!user || !firestore) return;

    const vitalsQuery = query(collection(firestore, `patients/${user.uid}/vitals`), orderBy("time", "desc"), limit(20));
    const alertsQuery = query(collection(firestore, 'alerts'), where('patientId', '==', user.uid), where('isRead', '==', false), orderBy('timestamp', 'desc'), limit(1));
    
    const unsubVitals = onSnapshot(vitalsQuery, (snapshot) => {
        const newVitals = snapshot.docs.map(doc => doc.data() as Vital);
        setVitals(newVitals);
        setLoadingVitals(false);
    });

    const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
        const newAlerts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert));
        setAlerts(newAlerts);
        setLoadingAlerts(false);
    });
    
    return () => {
        unsubVitals();
        unsubAlerts();
    }
  }, [user, firestore]);

  const handleDeviceSync = async () => {
      if (!userProfile?.deviceId) {
          toast({ variant: 'destructive', title: 'No Device Found', description: 'Please assign a device in your settings.' });
          return;
      }
      setIsSyncing(true);
      try {
          sendCommandToDevice(firestore, userProfile.deviceId, 'start_scan');
          toast({
            title: 'Scan Initiated',
            description: `A request has been sent to your device to start a new scan.`,
          });
      } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Sync Failed',
            description: error.message || 'Could not initiate device scan.',
          });
      } finally {
        setTimeout(() => setIsSyncing(false), 2000);
      }
  };

  const vitalCards = [
    {
      title: "Glucose",
      value: latestVital ? `${latestVital["Glucose"]} mg/dL` : 'N/A',
      status: "Critical",
      icon: <HeartPulse className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Blood Pressure",
      value: latestVital ? `${latestVital["Systolic"]}/${latestVital["Diastolic"]}` : 'N/A',
      status: "High",
      icon: <Droplets className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Heart Rate",
      value: latestVital ? `${latestVital["Heart Rate"]} BPM` : 'N/A',
      status: "Normal",
      icon: <HeartPulse className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  if (userLoading || loadingVitals || loadingAlerts) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="h-40 w-full" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
             <div className="grid gap-4 lg:grid-cols-3">
                <Skeleton className="lg:col-span-2 h-72 w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-headline text-2xl font-bold">Welcome, {userProfile?.displayName?.split(' ')[0]}!</h1>
          <Button onClick={handleDeviceSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2 h-4 w-4" />}
            {isSyncing ? 'Scanning...' : 'Scan Vitals Now'}
          </Button>
        </div>
        
       {activeAlert && (
         <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Active Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="font-bold">{activeAlert.message}</p>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="destructive">I Need Help Now</Button>
                    <Button variant="outline">Mark as Read</Button>
                </div>
            </CardContent>
        </Card>
       )}

        <div className="grid gap-4 md:grid-cols-3">
            {vitalCards.map((vital, index) => (
                <Card key={index}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>{vital.title}</span>
                            {vital.icon}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{vital.value}</div>
                        <Badge variant={vital.status === 'Critical' || vital.status === 'High' ? 'destructive' : 'default'} className={vital.status === 'Normal' ? 'bg-green-500' : ''}>{vital.status}</Badge>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Health Trends</CardTitle>
                    <CardDescription>Your glucose levels over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={vitals} dataKey1="Glucose" label1="Glucose" color1="hsl(var(--chart-1))" />
                    <Button variant="link" className="p-0 h-auto mt-2 text-sm as-child">
                      <Link href="/patient/health-data">View Detailed Trends →</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageCircle /> Medication Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm">Upcoming:</p>
                      <p className="text-muted-foreground">Metformin 500mg - Due in 30 minutes (3:00 PM)</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm">Mark as Taken</Button>
                        <Button size="sm" variant="outline">Snooze</Button>
                      </div>
                    </div>
                     <div>
                      <p className="font-semibold text-sm flex items-center gap-2"><CheckCircle className="text-green-500"/>Taken:</p>
                      <p className="text-muted-foreground">Amlodipine 5mg - (8:00 AM)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar/> Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Dr. Meera</p>
                  <p className="text-sm text-muted-foreground">25 Jan 2025, 10:00 AM</p>
                  <p className="text-sm text-muted-foreground">Tumkur PHC</p>
                  <Button variant="secondary" size="sm" className="mt-2 w-full as-child"><Link href="/patient/appointments">Manage Appointments</Link></Button>
                </CardContent>
              </Card>
          </div>
        </div>
    </main>
  );
}
