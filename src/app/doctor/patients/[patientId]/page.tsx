
'use client';

import { useParams, useRouter } from 'next/navigation';
import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import Image from "next/image";
import { ArrowLeft, Phone, MessageSquare, Pencil, Loader2, Info, Bot, Droplets, HeartPulse, Wind, Activity, AlertTriangle, BarChart2, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert as AlertBox, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateTrendAnalysis } from '@/app/actions';
import type { PatientProfile, HealthVital, AlertHistory } from "@/lib/types";
import useSWR from 'swr';
import { Skeleton } from "@/components/ui/skeleton";

type Statistics = {
  reading_count: number;
  temperature: { avg: number; max: number; min: number };
  spo2: { avg: number; max: number; min: number };
  heart_rate: { avg: number; max: number; min: number };
  predicted_glucose: { avg: number; max: number; min: number };
  predicted_bp_systolic: { avg: number; max: number; min: number };
  predicted_bp_diastolic: { avg: number; max: number; min: number };
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;

  const { data: patient, isLoading: patientLoading } = useSWR<PatientProfile | null>(patientId ? `/api/patients/${patientId}` : null, fetcher);
  const { data: vitals, isLoading: vitalsLoading } = useSWR<HealthVital[] | null>(patient?.device_id ? `/api/vitals/history/${patient.device_id}` : null, fetcher);
  const { data: alerts, isLoading: alertsLoading } = useSWR<AlertHistory[] | null>(patient?.patient_id ? `/api/alerts?patientId=${patient.patient_id}` : null, fetcher);
  const { data: stats, isLoading: statsLoading } = useSWR<Statistics | null>(patientId ? `/api/patients/${patientId}/statistics` : null, fetcher);
  
  const isLoading = patientLoading || vitalsLoading || alertsLoading || statsLoading;
  
  const [analysis, setAnalysis] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  if (!patientId) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Patient ID could not be found in the URL.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (isLoading) {
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
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </main>
    );
  }

  if (!patient) {
      return (
           <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patient List
              </Button>
              <Card>
                <CardHeader>
                  <CardTitle>Patient Not Found</CardTitle>
                  <CardDescription>The requested patient could not be found.</CardDescription>
                </CardHeader>
              </Card>
           </main>
      )
  }
  
  const latestVital = vitals && vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const getHeartRateStatus = (hr: number) => {
    if (hr > (patient.alert_threshold_hr_high || 100)) return 'High';
    if (hr < (patient.alert_threshold_hr_low || 60)) return 'Low';
    return 'Normal';
  };
  
  const getSpo2Status = (spo2: number) => {
    if (spo2 < (patient.alert_threshold_spo2_low || 95)) return 'Low';
    return 'Normal';
  }

  const vitalCards = latestVital ? [
    { title: "Glucose", value: `${latestVital.predicted_glucose?.toFixed(0) || 'N/A'} mg/dL`, icon: <Droplets />, status: (latestVital.predicted_glucose || 0) > (patient.alert_threshold_glucose_high || 180) ? 'High' : 'Normal' },
    { title: "Blood Pressure", value: `${latestVital.predicted_bp_systolic?.toFixed(0) || 'N/A'}/${latestVital.predicted_bp_diastolic?.toFixed(0) || 'N/A'}`, icon: <HeartPulse />, status: (latestVital.predicted_bp_systolic || 0) > (patient.alert_threshold_bp_systolic_high || 130) ? 'High' : 'Normal' },
    { title: "Heart Rate", value: `${latestVital.heart_rate.toFixed(0)} BPM`, icon: <Activity />, status: getHeartRateStatus(latestVital.heart_rate) },
    { title: "SpO2", value: `${latestVital.spo2.toFixed(1)}%`, icon: <Wind />, status: getSpo2Status(latestVital.spo2) },
    { title: "Temperature", value: `${latestVital.temperature.toFixed(1)}°C`, icon: <Thermometer />, status: latestVital.temperature > 38 ? 'High' : 'Normal' },

  ] : [];

  const handleGenerateAnalysis = async () => {
      if (!patient || !vitals || vitals.length === 0) return;
      setIsGenerating(true);
      setAnalysis(null);
      
      try {
        const result = await generateTrendAnalysis({ 
          patient_profile: {
            age: patient.age,
            gender: patient.gender,
            has_diabetes: patient.has_diabetes,
            has_hypertension: patient.has_hypertension,
            has_heart_condition: patient.has_heart_condition
          },
          historical_vitals: vitals.slice(-20) // Send last 20 readings for analysis
         });
        if (result.error) throw new Error(result.error);
        setAnalysis(result.data || "No analysis could be generated.");
      } catch (error: any) {
        console.error("Failed to generate analysis:", error);
        setAnalysis(`Could not generate an analysis at this time: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    };
    
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
                  <Image src={patient.avatar_url || `https://ui-avatars.com/api/?name=${patient.name}`} alt={patient.name || ''} width={64} height={64} className="rounded-full object-cover" />
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
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          
           {stats && stats.reading_count > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2/> Health Statistics</CardTitle>
                    <CardDescription>Summary of all recorded vitals.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between"><span>Total Readings:</span> <span className="font-bold">{stats.reading_count}</span></div>
                    <div className="flex justify-between"><span>Avg. Heart Rate:</span> <span className="font-bold">{stats.heart_rate.avg} bpm</span></div>
                    <div className="flex justify-between"><span>Avg. SpO2:</span> <span className="font-bold">{stats.spo2.avg}%</span></div>
                    <div className="flex justify-between"><span>Avg. Glucose (est.):</span> <span className="font-bold">{stats.predicted_glucose.avg} mg/dL</span></div>
                    <div className="flex justify-between"><span>Avg. Blood Pressure (est.):</span> <span className="font-bold">{stats.predicted_bp_systolic.avg}/{stats.predicted_bp_diastolic.avg} mmHg</span></div>
                </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Glucose & BP Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <VitalsChart 
                  data={vitals?.map(v => ({...v, time: format(new Date(v.timestamp), 'p') })) || []} 
                  dataKey1="predicted_glucose" 
                  label1="Glucose (mg/dL)" 
                  color1="hsl(var(--chart-1))" 
                  dataKey2="predicted_bp_systolic"
                  label2="BP (Systolic)"
                  color2="hsl(var(--chart-2))"
                />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
             <AlertBox variant="default" className="bg-accent/20 border-accent/50">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">Estimation, Not Diagnosis</AlertTitle>
                <AlertDescription>
                    The AI predictions shown are for informational purposes and are not a substitute for clinical judgment.
                </AlertDescription>
            </AlertBox>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Bot /> AI Trend Analysis
                    </CardTitle>
                    <CardDescription>
                    Generate a summary of the patient's recent health trends based on their profile and historical vitals.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerateAnalysis} disabled={isGenerating || !vitals || vitals.length === 0}>
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Analysis
                    </Button>
                    {analysis && (
                    <AlertBox className="mt-4">
                        <Bot className="h-4 w-4" />
                        <AlertTitle>AI Analysis</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">
                        {analysis}
                        </AlertDescription>
                    </AlertBox>
                    )}
                </CardContent>
            </Card>

           <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {alerts && alerts.length > 0 ? alerts.slice(0, 5).map(alert => (
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
