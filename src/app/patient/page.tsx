'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { HeartPulse, Droplets, Thermometer, Wind, Wifi, Bot, ShieldCheck, Loader2, Info } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { collection, limit, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Vital } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { EstimateHealthMetricsOutput } from '@/ai/flows/suggest-initial-diagnoses';
import { cn } from '@/lib/utils';
import { triggerVitalsScanAndAnalysis } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

export default function PatientPage() {
  const { user, userProfile, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const vitalsQuery = React.useMemo(() =>
    user ? query(collection(firestore, `users/${user.uid}/vitals`), orderBy("timestamp", "desc"), limit(1)) : null,
    [user, firestore]
  );
  const { data: vitalsData, loading: loadingVitals } = useCollection<Vital>(vitalsQuery);

  const estimationsQuery = React.useMemo(() =>
    user ? query(collection(firestore, `users/${user.uid}/estimations`), orderBy("timestamp", "desc"), limit(1)) : null,
    [user, firestore]
  );
  const { data: estimationsData, loading: loadingEstimations } = useCollection<EstimateHealthMetricsOutput>(estimationsQuery);

  const latestVital = vitalsData && vitalsData.length > 0 ? vitalsData[0] : null;
  const latestEstimation = estimationsData && estimationsData.length > 0 ? estimationsData[0] : null;

  const handleDeviceSync = async () => {
    if (!user || !userProfile) return;
    if (isSyncing) return;
    
    setIsSyncing(true);
    toast({
        title: 'Initiating Scan...',
        description: `Requesting a new reading from your device. This will take a moment.`,
    });

    const result = await triggerVitalsScanAndAnalysis(user.uid);
    
    setIsSyncing(false);
    
    if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Scan Failed',
            description: result.error,
        });
    } else {
        toast({
            title: 'Scan Complete!',
            description: `Your latest vitals have been recorded and analyzed.`,
        });
    }
  };

  const bp = latestVital ? {
      systolic: latestVital["Systolic"],
      diastolic: latestVital["Diastolic"],
      map: Math.round(latestVital["Diastolic"] + (latestVital["Systolic"] - latestVital["Diastolic"]) / 3),
      pulsePressure: latestVital["Systolic"] - latestVital["Diastolic"],
      stage: latestVital["Systolic"] >= 140 || latestVital["Diastolic"] >= 90 ? 'Stage 2 Hypertension' : (latestVital["Systolic"] >= 130 ? 'Stage 1 Hypertension' : (latestVital["Systolic"] > 120 ? 'Elevated' : 'Normal'))
  } : null;
  
  const heart = latestVital && bp ? {
      rate: latestVital["Heart Rate"],
      shockIndex: bp.systolic > 0 ? (latestVital["Heart Rate"] / bp.systolic).toFixed(2) : 'N/A'
  } : null;

  const glucose = latestVital ? latestVital["Glucose"] : null;
  const glucoseStatus = glucose ? (glucose > 180 ? 'Critical' : (glucose > 140 ? 'High' : 'Normal')) : 'Normal';

  const isLoading = userLoading || loadingVitals || loadingEstimations;

  return (
    <div className="p-4 space-y-4">
        <Card onClick={handleDeviceSync} className="bg-primary text-primary-foreground border-0 cursor-pointer hover:bg-primary/90 transition-all active:scale-[0.98]">
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

        {isLoading ? <Skeleton className="h-32 w-full rounded-lg" /> : glucose !== null && (
            <Card className={cn("border-2", glucoseStatus === 'Critical' ? "border-destructive bg-destructive/5" : "border-transparent")}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                        <span className='flex items-center gap-2'><span className={cn('h-2 w-2 rounded-full', getStatusColor(glucoseStatus))}></span>GLUCOSE LEVEL</span>
                        {glucoseStatus === 'Critical' && <span className="text-xs font-bold text-destructive-foreground bg-destructive px-2 py-0.5 rounded-full">CRITICAL</span>}
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex items-center justify-between'>
                    <div>
                        <p className="text-4xl font-bold">{glucose}<span className="text-lg text-muted-foreground ml-1">mg/dL</span></p>
                        <p className="text-sm font-semibold">{glucose > 180 ? 'Diabetes/High' : 'Normal'}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
             {isLoading ? <Skeleton className="h-48 w-full rounded-lg" /> : bp && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><HeartPulse className='text-red-500'/> BP</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-3xl font-bold">{bp.systolic}<span className='text-muted-foreground'>/</span>{bp.diastolic}<span className="text-base text-muted-foreground ml-1">mmHg</span></p>
                        <div className="grid grid-cols-2 text-xs gap-1 pt-1">
                            <div><p className='text-muted-foreground'>MAP</p><p className='font-bold'>{bp.map}</p></div>
                            <div><p className='text-muted-foreground'>PULSE P.</p><p className='font-bold'>{bp.pulsePressure}</p></div>
                        </div>
                        <p className={cn("text-xs font-bold pt-1", getStatusColor(bp.stage))}>{bp.stage}</p>
                    </CardContent>
                </Card>
             )}

             {isLoading ? <Skeleton className="h-48 w-full rounded-lg" /> : heart && (
                <Card>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><HeartPulse className='text-blue-500'/> HEART RATE</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-2">
                        <p className="text-3xl font-bold">{heart.rate}<span className="text-base text-muted-foreground ml-1">bpm</span></p>
                         <div className="grid grid-cols-2 text-xs gap-1 pt-1">
                            <div><p className='text-muted-foreground'>SHOCK INDEX</p><p className='font-bold'>{heart.shockIndex}</p></div>
                        </div>
                    </CardContent>
                </Card>
            )}

             {isLoading ? <Skeleton className="h-36 w-full rounded-lg" /> : latestVital && (
                <Card>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Wind className='text-green-500'/> SPO2</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-3xl font-bold">{latestVital["SPO2"]}<span className="text-base text-muted-foreground">%</span></p>
                        <p className="text-xs font-semibold text-muted-foreground pt-1">Oxygen Saturation</p>
                    </CardContent>
                </Card>
             )}

             {isLoading ? <Skeleton className="h-36 w-full rounded-lg" /> : latestVital?.Temperature && (
                 <Card>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Thermometer className='text-orange-500'/> TEMP</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-3xl font-bold">{latestVital["Temperature"]}<span className="text-base text-muted-foreground">°F</span></p>
                         <p className="text-xs font-semibold text-muted-foreground pt-1">Body Temperature</p>
                    </CardContent>
                </Card>
             )}
        </div>

        {isLoading ? <Skeleton className="h-32 w-full rounded-lg" /> : latestEstimation && (
             <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                         <span className='flex items-center gap-2'><ShieldCheck /> Health Prediction</span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI POWERED</span>
                    </CardTitle>
                </CardHeader>
                 <CardContent className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className="text-xs text-muted-foreground">AI CONFIDENCE</p>
                        <p className="text-lg font-bold">{Math.round(latestEstimation.confidenceScore * 100)}%</p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">PREDICTED GLUCOSE TREND</p>
                         <p className={cn("text-lg font-bold", getStatusColor(latestEstimation.glucoseTrend))}>{latestEstimation.glucoseTrend}</p>
                    </div>
                    <div className='col-span-2 text-xs text-muted-foreground pt-2 italic'>
                        {latestEstimation.reasoning}
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
