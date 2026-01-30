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
import type { UserProfile, Vital, Alert } from "@/lib/types";
import { mockPatients, mockVitals, mockEstimations, mockAlerts } from "@/lib/mock-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert as AlertBox, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  
  const patient = mockPatients.find(p => p.uid === patientId);
  const vitals = mockVitals[patientId] || [];
  const estimations = mockEstimations[patientId] || [];
  const alerts = mockAlerts.filter(a => a.patientId === patientId);

  const loading = false;

  const latestVital = vitals && vitals.length > 0 ? vitals[0] : null;

  const vitalCards = latestVital ? [
    { title: "Glucose", value: `${latestVital['Glucose']} mg/dL`, icon: <Droplets />, status: latestVital['Glucose'] > 180 ? 'High' : 'Normal' },
    { title: "Blood Pressure", value: `${latestVital['Systolic']}/${latestVital['Diastolic']}`, icon: <HeartPulse />, status: latestVital['Systolic'] > 130 ? 'High' : 'Normal' },
    { title: "Heart Rate", value: `${latestVital['Heart Rate']} BPM`, icon: <Activity />, status: "Normal" },
    { title: "SpO2", value: `${latestVital['SPO2']}%`, icon: <Wind />, status: latestVital['SPO2'] < 95 ? 'Low' : 'Normal' },
  ] : [];

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  if (!patient) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Patient not found</h2>
          <p className="text-muted-foreground">The patient you are looking for does not exist.</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }


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
                  <Image src={patient.avatarUrl || `https://i.pravatar.cc/150?u=${patient.uid}`} alt={patient.displayName} width={64} height={64} className="rounded-full object-cover" />
                  <div>
                    <CardTitle className="text-2xl font-headline">{patient.displayName}</CardTitle>
                    <CardDescription>{patient.age} y/o {patient.gender} | ID: {patient.uid}</CardDescription>
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
              <p className="text-sm"><strong>Conditions:</strong> {patient.conditions?.join(', ')}</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>Current Vitals</CardTitle>
                <CardDescription>Last updated: {latestVital?.timestamp ? format(latestVital.timestamp.toDate(), 'PPpp') : 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {vitalCards.length > 0 ? vitalCards.map(vital => (
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
              <VitalsChart 
                data={vitals?.map(v => ({...v, time: v.timestamp?.toDate ? format(v.timestamp.toDate(), 'p') : 'N/A' })).reverse() || []} 
                dataKey1="Glucose" 
                label1="Glucose (mg/dL)" 
                color1="hsl(var(--chart-1))" 
                dataKey2="Systolic"
                label2="BP (Systolic)"
                color2="hsl(var(--chart-2))"
              />
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
                    <CardTitle className="flex items-center gap-2"><Bot />AI Health Estimations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {estimations && estimations.map((est, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-secondary/30">
                            <p className="font-semibold text-sm">Prediction from {est.timestamp?.toDate ? format(est.timestamp.toDate(), 'p') : 'N/A'}</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                    <p className="text-muted-foreground">BP Category</p>
                                    <p className="font-bold">{est.estimatedBpCategory}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Glucose Trend</p>
                                    <p className={cn("font-bold", est.glucoseTrend === 'Risky' && 'text-destructive')}>{est.glucoseTrend}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic mt-2">{est.reasoning}</p>
                            <p className="text-xs font-medium text-right mt-1">Confidence: {Math.round(est.confidenceScore * 100)}%</p>
                        </div>
                    ))}
                     {(!estimations || estimations.length === 0) && <p className="text-sm text-muted-foreground">No AI estimations available for this patient.</p>}
                </CardContent>
            </Card>

           <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {alerts && alerts.length > 0 ? alerts.map(alert => (
                        <div key={alert.id} className="flex gap-3">
                            <AlertTriangle className={cn("mt-1", alert.severity === 'Critical' || alert.severity === 'High' ? 'text-destructive' : 'text-yellow-500')}/>
                            <div>
                                <p className="font-medium text-sm">{alert.message}</p>
                                <p className="text-xs text-muted-foreground">{alert.timestamp?.toDate() ? format(alert.timestamp.toDate(), 'PPpp') : 'N/A'}</p>
                            </div>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No recent alerts for this patient.</p>}
                     <Button variant="secondary" size="sm" className="mt-4 w-full">View All Alerts</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
