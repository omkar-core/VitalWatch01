"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import Image from "next/image";
import { ArrowLeft, Phone, MessageSquare, Pencil, Loader2, Info, Bot, Droplets, HeartPulse, Wind, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { PatientProfile, HealthVital, AlertHistory } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert as AlertBox, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useSWR from 'swr';
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).status = res.status;
    throw error;
  }
  return res.json()
});

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  
  const swrOptions = {
    errorRetryInterval: 2000,
    errorRetryCount: 3,
  };
  
  const { data: patient, error: patientError, isLoading: patientLoading } = useSWR<PatientProfile>(patientId ? `/api/patients/${patientId}` : null, fetcher, swrOptions);
  const { data: vitals, error: vitalsError, isLoading: vitalsLoading } = useSWR<HealthVital[]>(patient?.device_id ? `/api/vitals/history/${patient.device_id}` : null, fetcher, swrOptions);
  const { data: alerts, error: alertsError, isLoading: alertsLoading } = useSWR<AlertHistory[]>(patientId ? `/api/alerts?patientId=${patientId}` : null, fetcher, swrOptions);

  const loading = patientLoading || vitalsLoading || alertsLoading;
  
  const latestVital = vitals && vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const vitalCards = latestVital ? [
    { title: "Glucose", value: `${latestVital.predicted_glucose?.toFixed(0) || 'N/A'} mg/dL`, icon: <Droplets />, status: (latestVital.predicted_glucose || 0) > 180 ? 'High' : 'Normal' },
    { title: "Blood Pressure", value: `${latestVital.predicted_bp_systolic?.toFixed(0) || 'N/A'}/${latestVital.predicted_bp_diastolic?.toFixed(0) || 'N/A'}`, icon: <HeartPulse />, status: (latestVital.predicted_bp_systolic || 0) > 130 ? 'High' : 'Normal' },
    { title: "Heart Rate", value: `${latestVital.heart_rate.toFixed(0)} BPM`, icon: <Activity />, status: "Normal" },
    { title: "SpO2", value: `${latestVital.spo2.toFixed(1)}%`, icon: <Wind />, status: latestVital.spo2 < 95 ? 'Low' : 'Normal' },
  ] : [];

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin h-12 w-12" /></div>
  }

  if (!patient || patientError) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Patient not found</h2>
          <p className="text-muted-foreground">The patient you are looking for does not exist or there was an error loading the data.</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const conditions = [
      patient.has_diabetes && "Diabetes",
      patient.has_hypertension && "Hypertension",
      patient.has_heart_condition && "Heart Condition"
    ].filter(Boolean).join(', ');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patient List
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Image src={`https://i.pravatar.cc/150?u=${patient.patient_id}`} alt={patient.name || ''} width={64} height={64} className="rounded-full object-cover" />
                  <div>
                    <CardTitle className="text-2xl font-headline">{patient.name}</CardTitle>
                    <CardDescription>{patient.age} y/o {patient.gender} | ID: {patient.patient_id}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline"><Phone className="mr-2"/>Call</Button>
                  <Button variant="outline"><MessageSquare className="mr-2"/>Message</Button>
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm"><strong>Conditions:</strong> {conditions || 'N/A'}</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>Current Vitals</CardTitle>
                <CardDescription>Last updated: {latestVital?.timestamp ? format(new Date(latestVital.timestamp), 'PPpp') : 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {vitalsLoading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />) :
                  vitalCards.length > 0 ? vitalCards.map(vital => (
                    <div key={vital.title} className="p-4 rounded-lg border flex flex-col gap-1 bg-card">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            {vital.icon} {vital.title}
                        </div>
                        <p className="text-2xl font-bold">{vital.value}</p>
                        <Badge variant={vital.status === 'High' || vital.status === 'Low' || vital.status === 'Critical' ? 'destructive' : 'default'} className="w-fit">{vital.status}</Badge>
                    </div>
                )) : <p className="col-span-4 text-muted-foreground">No vital readings available.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Glucose & BP Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {vitalsLoading ? <Skeleton className="h-48 w-full" /> : 
                <VitalsChart 
                  data={vitals?.map(v => ({...v, time: format(new Date(v.timestamp), 'p') })) || []} 
                  dataKey1="predicted_glucose" 
                  label1="Glucose (mg/dL)" 
                  color1="hsl(var(--chart-1))" 
                  dataKey2="predicted_bp_systolic"
                  label2="BP (Systolic)"
                  color2="hsl(var(--chart-2))"
                />
              }
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2">
                    <Textarea placeholder="Add a new note..." />
                    <Button>Add Note</Button>
                </div>
              </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
             <AlertBox variant="default" className="bg-accent/20 border-accent/50">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">Estimation, Not Diagnosis</AlertTitle>
                <AlertDescription>
                    The AI predictions shown are for informational purposes and are not a substitute for clinical judgement.
                </AlertDescription>
            </AlertBox>

           <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {alertsLoading ? <Skeleton className="h-32 w-full"/> : 
                      alerts && alerts.length > 0 ? alerts.slice(0, 5).map(alert => (
                        <div key={alert.alert_id} className="flex gap-3">
                            <AlertTriangle className={cn("mt-1", alert.severity === 'Critical' || alert.severity === 'High' ? 'text-destructive' : 'text-yellow-500')}/>
                            <div>
                                <p className="font-medium text-sm">{alert.alert_message}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(alert.alert_timestamp), 'PPpp')}</p>
                            </div>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No recent alerts for this patient.</p>}
                     <Button variant="secondary" size="sm" className="mt-4 w-full" asChild><Link href="/doctor/alerts">View All Alerts</Link></Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
