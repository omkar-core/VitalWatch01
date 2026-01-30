'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { HeartPulse, Droplets, Thermometer, Wind, Wifi, Bot, ShieldCheck, Loader2, Info, Activity } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ingestVitalsAction } from '@/app/actions';
import type { HealthVital, PatientProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/firebase/auth/use-user';
import useSWR from 'swr';

// Helper function to get status colors
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'critical':
        case 'stage 2 hypertension':
        case 'risky':
            return 'text-destructive';
        case 'high':
        case 'stage 1 hypertension':
        case 'elevated':
            return 'text-yellow-600';
        case 'normal':
            return 'text-green-600';
        default:
            return 'text-muted-foreground';
    }
};

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).status = res.status;
    throw error;
  }
  return res.json()
});


export default function PatientPage() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { user } = useUser();

  const swrOptions = {
    errorRetryInterval: 2000,
    errorRetryCount: 5,
  };

  const { data: patientData, isLoading: patientLoading } = useSWR<PatientProfile>(user ? `/api/patients/${user.uid}` : null, fetcher, swrOptions);
  const { data: vitalsData, isLoading: vitalsLoading, mutate: mutateVitals } = useSWR<HealthVital>(patientData?.device_id ? `/api/vitals/latest/${patientData.device_id}` : null, fetcher, swrOptions);

  const patient: PatientProfile | null = patientData || null;
  const latestVital: HealthVital | null = vitalsData || null;

  const handleDeviceSync = async () => {
    if (isSyncing || !patient?.device_id) return;
    
    setIsSyncing(true);
    toast({
        title: 'Initiating Scan...',
        description: `Requesting a new reading from your device.`,
    });

    // Simulate generating data from the ESP32 device
    const mockESP32Data = [{
      deviceId: patient.device_id,
      ts: new Date().toISOString(),
      heart_rate: 70 + Math.random() * 15,
      spo2: 96 + Math.random() * 3,
      ppg_raw: 1000 + Math.random() * 200,
    }];
    
    const result = await ingestVitalsAction(mockESP32Data);

    if (result.error) {
       toast({
            variant: 'destructive',
            title: 'Scan Failed!',
            description: result.error,
        });
    } else {
        toast({
            title: 'Scan Complete!',
            description: `Your latest vitals have been recorded and analyzed.`,
        });
        // Re-fetch the latest vitals
        mutateVitals();
    }
    
    setIsSyncing(false);
  };

  const bp = latestVital ? {
      systolic: latestVital.predicted_bp_systolic || 0,
      diastolic: latestVital.predicted_bp_diastolic || 0,
      map: Math.round((latestVital.predicted_bp_diastolic || 0) + ((latestVital.predicted_bp_systolic || 0) - (latestVital.predicted_bp_diastolic || 0)) / 3),
      pulsePressure: (latestVital.predicted_bp_systolic || 0) - (latestVital.predicted_bp_diastolic || 0),
      stage: (latestVital.predicted_bp_systolic || 0) >= 140 || (latestVital.predicted_bp_diastolic || 0) >= 90 ? 'Stage 2 Hypertension' : ((latestVital.predicted_bp_systolic || 0) >= 130 ? 'Stage 1 Hypertension' : ((latestVital.predicted_bp_systolic || 0) > 120 ? 'Elevated' : 'Normal'))
  } : null;
  
  const heart = latestVital && bp ? {
      rate: latestVital.heart_rate,
      shockIndex: bp.systolic > 0 ? (latestVital.heart_rate / bp.systolic).toFixed(2) : 'N/A'
  } : null;

  const glucose = latestVital ? latestVital.predicted_glucose : null;
  const glucoseStatus = glucose ? (glucose > 180 ? 'Critical' : (glucose > 140 ? 'High' : 'Normal')) : 'Normal';

  const isLoading = patientLoading || vitalsLoading;

  return (
    <div className="p-4 space-y-4">
        <Card onClick={handleDeviceSync} className="bg-primary text-primary-foreground border-0 cursor-pointer hover:bg-primary/90 transition-all active:scale-[0.98] hover:shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-primary-foreground/20 rounded-lg">
                    {isSyncing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Wifi className="h-6 w-6" />}
                </div>
                <div>
                    <h2 className="font-bold text-lg font-headline">Scan Vitals Now</h2>
                    <p className="text-sm opacity-80">{isSyncing ? 'Scanning...' : 'Ready to Scan'}</p>
                </div>
            </CardContent>
        </Card>

        <Alert variant="default" className="bg-accent/20 border-accent/50">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-semibold">Not a Medical Device</AlertTitle>
            <AlertDescription>
                This system provides health estimations for informational purposes only. Consult a doctor for medical advice.
            </AlertDescription>
        </Alert>

        {isLoading ? (
            <>
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                </div>
            </>
        ) : latestVital ? (
            <>
                {glucose !== null && glucose !== undefined && (
                    <Card className={cn("border-2 transition-all hover:shadow-md", glucoseStatus === 'Critical' ? "border-destructive bg-destructive/5" : "border-transparent")}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                                <span className='flex items-center gap-2'><Droplets className='text-red-500'/>GLUCOSE LEVEL</span>
                                {glucoseStatus === 'Critical' && <span className="text-xs font-bold text-destructive-foreground bg-destructive px-2 py-0.5 rounded-full">CRITICAL</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center justify-between'>
                            <div>
                                <p className="text-4xl font-bold">{glucose.toFixed(0)}<span className="text-lg text-muted-foreground ml-1">mg/dL</span></p>
                                <p className="text-sm font-semibold">{glucose > 180 ? 'Diabetes/High' : 'Normal'}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {bp && (
                        <Card className="transition-all hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><HeartPulse className='text-red-500'/> BLOOD PRESSURE</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-3xl font-bold">{bp.systolic.toFixed(0)}<span className='text-muted-foreground'>/</span>{bp.diastolic.toFixed(0)}<span className="text-base text-muted-foreground ml-1">mmHg</span></p>
                                <div className="grid grid-cols-2 text-xs gap-1 pt-1">
                                    <div><p className='text-muted-foreground'>MAP</p><p className='font-bold'>{bp.map}</p></div>
                                    <div><p className='text-muted-foreground'>PULSE P.</p><p className='font-bold'>{bp.pulsePressure}</p></div>
                                </div>
                                <p className={cn("text-xs font-bold pt-1", getStatusColor(bp.stage))}>{bp.stage}</p>
                            </CardContent>
                        </Card>
                    )}

                    {heart && (
                        <Card className="transition-all hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Activity className='text-blue-500'/> HEART RATE</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-3xl font-bold">{heart.rate.toFixed(0)}<span className="text-base text-muted-foreground ml-1">bpm</span></p>
                                <div className="grid grid-cols-2 text-xs gap-1 pt-1">
                                    <div><p className='text-muted-foreground'>SHOCK INDEX</p><p className='font-bold'>{heart.shockIndex}</p></div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {latestVital && (
                        <Card className="transition-all hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Wind className='text-green-500'/> SpO2</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{latestVital.spo2.toFixed(1)}<span className="text-base text-muted-foreground">%</span></p>
                                <p className="text-xs font-semibold text-muted-foreground pt-1">Oxygen Saturation</p>
                            </CardContent>
                        </Card>
                    )}

                    {latestVital?.ppg_raw && (
                        <Card className="transition-all hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Thermometer className='text-orange-500'/> PPG</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{latestVital.ppg_raw.toFixed(0)}</p>
                                <p className="text-xs font-semibold text-muted-foreground pt-1">Raw PPG Signal</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </>
        ) : (
            <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold tracking-tight">No Vitals Recorded Yet</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Click "Scan Vitals Now" above to get your first reading.
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
