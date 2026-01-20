"use client";

import { useParams, useRouter } from "next/navigation";
import { patients } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import Image from "next/image";
import { ArrowLeft, Phone, MessageSquare, Pencil, User, HeartPulse, Droplets, Wind, Thermometer } from "lucide-react";
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

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const patient = patients.find((p) => p.id === patientId);

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

  const latestVitals = patient.vitals[patient.vitals.length - 1];

  const vitalCards = [
    { title: "Glucose", value: `${latestVitals['Heart Rate']} mg/dL`, icon: <HeartPulse />, status: patient.status === 'Critical' ? "Critical" : "High" },
    { title: "Blood Pressure", value: latestVitals['Blood Pressure'], icon: <Droplets />, status: "High" },
    { title: "Heart Rate", value: `92 BPM`, icon: <HeartPulse />, status: "Normal" },
    { title: "SpO2", value: `${latestVitals['SPO2']}%`, icon: <Wind />, status: "Normal" },
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
                  <Image src={patient.avatarUrl} alt={patient.name} width={64} height={64} className="rounded-full" data-ai-hint={patient.avatarHint}/>
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
              <p className="text-sm"><strong>Conditions:</strong> Type 2 Diabetes, Hypertension Stage 1</p>
              <p className="text-sm text-muted-foreground">Enrolled: 15 Dec 2024 | Device: CGM_LIBRE_45678</p>
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
                        <Badge variant={vital.status === 'Critical' || vital.status === "High" ? 'destructive' : 'default'} className="w-fit">{vital.status}</Badge>
                    </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Glucose & BP Trend (Last 24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <VitalsChart data={patient.vitals} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Medication & Treatment</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <h4 className="font-semibold">Current Medications</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        <li>Metformin 500mg - 2x daily</li>
                        <li>Amlodipine 5mg - 1x daily</li>
                    </ul>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold">Alert Thresholds</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        <li>Glucose: High &gt; 300, Low &lt; 70</li>
                        <li>BP: High &gt; 160/100</li>
                    </ul>
                </div>
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
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>19 Jan:</strong> Called patient to advise on insulin adjustment due to high reading.</p>
                    <p><strong>15 Jan:</strong> Patient reports better sleep after med adjustment.</p>
                    <p><strong>10 Jan:</strong> Advised to reduce carb intake in dinner.</p>
                </div>
                <div className="mt-4 space-y-2">
                    <Textarea placeholder="Add a new note..." />
                    <Button>Add Note</Button>
                </div>
              </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
          <AiAssistant patient={patient} />
          
           <Card>
                <CardHeader>
                    <CardTitle>Alert History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-sm">
                            <p className="font-medium text-destructive">High Glucose (380 mg/dL)</p>
                            <p className="text-xs text-muted-foreground">19 Jan, 2:34 PM | SMS Sent</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-yellow-500">Predicted Spike</p>
                            <p className="text-xs text-muted-foreground">18 Jan, 11:45 PM | SMS Sent</p>
                        </div>
                         <div className="text-sm">
                            <p className="font-medium text-destructive">High BP (165/110 mmHg)</p>
                            <p className="text-xs text-muted-foreground">17 Jan, 3:20 PM | SMS Sent</p>
                        </div>
                    </div>
                     <Button variant="secondary" size="sm" className="mt-4 w-full">View All Alerts</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
