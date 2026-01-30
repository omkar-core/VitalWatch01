"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import Image from "next/image";
import { ArrowLeft, Phone, MessageSquare, Pencil, User, HeartPulse, Droplets, Wind, Thermometer, Loader2 } from "lucide-react";
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
import { useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { Patient } from "@/lib/types";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  
  const firestore = useFirestore();
  const patientRef = doc(firestore, 'patients', patientId);
  const { data: patient, loading } = useDoc<Patient>(patientRef);

  useEffect(() => {
    if (patient) {
      document.title = `${patient.name} - Patient Details | VitalWatch`;
    } else if (!loading) {
      document.title = 'Patient Not Found | VitalWatch';
    }
  }, [patient, loading]);

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

  // Placeholder until vitals subcollection is implemented
  const latestVitals = { 'Glucose': 0, 'Systolic': 0, 'Diastolic': 0, 'Heart Rate': 0, 'SPO2': 0 };

  const vitalCards = [
    { title: "Glucose", value: `${latestVitals['Glucose']} mg/dL`, icon: <HeartPulse />, status: 'Normal' },
    { title: "Blood Pressure", value: `${latestVitals['Systolic']}/${latestVitals['Diastolic']}`, icon: <Droplets />, status: 'Normal' },
    { title: "Heart Rate", value: `${latestVitals['Heart Rate']} BPM`, icon: <HeartPulse />, status: "Normal" },
    { title: "SpO2", value: `${latestVitals['SPO2']}%`, icon: <Wind />, status: 'Normal' },
  ];

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
                  <Image src={patient.avatarUrl} alt={patient.name} width={64} height={64} className="rounded-full object-cover" data-ai-hint={patient.avatarHint}/>
                  <div>
                    <CardTitle className="text-2xl font-headline">{patient.name}</CardTitle>
                    <CardDescription>{patient.age} y/o {patient.gender} | ID: {patient.id}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline"><Phone className="mr-2"/>Call Patient</Button>
                  <Button variant="outline"><MessageSquare className="mr-2"/>Send Message</Button>
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
                <CardDescription>Last updated: 2 min ago</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {vitalCards.map(vital => (
                    <div key={vital.title} className="p-4 rounded-lg border flex flex-col gap-1 bg-card">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            {vital.icon} {vital.title}
                        </div>
                        <p className="text-2xl font-bold">{vital.value}</p>
                        <Badge variant={vital.status === 'High' || vital.status === 'Low' || vital.status === 'Critical' ? 'destructive' : 'default'} className="w-fit">{vital.status}</Badge>
                    </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Glucose & BP Trend (Last 24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <VitalsChart 
                data={[]} 
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
                <CardTitle>Medication & Treatment</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="mt-4 flex gap-2">
                    <Button variant="outline">Edit Medications</Button>
                    <Button variant="outline">Adjust Thresholds</Button>
                </div>
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
           <Card>
                <CardHeader>
                    <CardTitle>Alert History</CardTitle>
                </CardHeader>
                <CardContent>
                     <Button variant="secondary" size="sm" className="mt-4 w-full">View All Alerts</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
