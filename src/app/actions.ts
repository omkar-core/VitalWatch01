"use server";

import { estimateHealthMetrics, EstimateHealthMetricsInput } from "@/ai/flows/suggest-initial-diagnoses";
import { collection, addDoc, query, orderBy, limit, getDocs, doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Vital, UserProfile, Alert } from '@/lib/types';
import { sendTelegramAlert } from "@/lib/telegram";


type ActionResult<T> = {
    data?: T;
    error?: string;
}

export async function estimateHealthMetricsAction(input: EstimateHealthMetricsInput): Promise<ActionResult<Awaited<ReturnType<typeof estimateHealthMetrics>>>> {
    try {
        const output = await estimateHealthMetrics(input);
        return { data: output };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unknown error occurred.' };
    }
}


export async function triggerVitalsScanAndAnalysis(patientId: string): Promise<ActionResult<string>> {
  const { firestore } = initializeFirebase();
  if (!patientId) {
    return { error: 'Patient ID is missing.' };
  }

  try {
    const patientDocRef = doc(firestore, 'users', patientId);
    const patientDoc = await getDoc(patientDocRef);
    if (!patientDoc.exists()) throw new Error('Patient profile not found.');
    const patientProfile = patientDoc.data() as UserProfile;

    const vitalsCollection = collection(firestore, `users/${patientId}/vitals`);
    const lastVitalQuery = query(vitalsCollection, orderBy('timestamp', 'desc'), limit(1));
    const lastVitalsSnapshot = await getDocs(lastVitalQuery);
    const lastVital = lastVitalsSnapshot.docs.length > 0 ? lastVitalsSnapshot.docs[0].data() as Vital : null;

    const newVitalData: Omit<Vital, 'id' | 'timestamp'> = {
        'Glucose': Math.round(lastVital ? lastVital.Glucose + (Math.random() - 0.45) * 20 : 120 + (Math.random() - 0.5) * 40),
        'Systolic': Math.round(lastVital ? lastVital.Systolic + (Math.random() - 0.48) * 10 : 120 + (Math.random() - 0.5) * 20),
        'Diastolic': Math.round(lastVital ? lastVital.Diastolic + (Math.random() - 0.48) * 8 : 80 + (Math.random() - 0.5) * 10),
        'Heart Rate': Math.round(lastVital ? lastVital['Heart Rate'] + (Math.random() - 0.5) * 6 : 75 + (Math.random() - 0.5) * 10),
        'SPO2': Math.round(lastVital ? Math.min(100, lastVital.SPO2 + (Math.random() - 0.6) * 2) : 98 + (Math.random() - 0.5) * 2),
        'Temperature': parseFloat((lastVital?.Temperature ? lastVital.Temperature + (Math.random() - 0.5) * 0.5 : 98.6 + (Math.random() - 0.5) * 1).toFixed(1)),
    };

    await addDoc(vitalsCollection, {
      ...newVitalData,
      timestamp: serverTimestamp(),
    });

    const historyQuery = query(vitalsCollection, orderBy('timestamp', 'desc'), limit(5));
    const historySnapshot = await getDocs(historyQuery);
    const recentVitals = historySnapshot.docs.map(d => {
        const data = d.data();
        const ts = data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString();
        return { ...data, timestamp: ts } as Vital;
    });

    const aiInput: EstimateHealthMetricsInput = {
      age: patientProfile.age || 30,
      gender: patientProfile.gender || 'Other',
      medicalHistory: patientProfile.medicalHistory || '',
      currentVitals: { ...newVitalData, timestamp: new Date().toISOString() },
      recentVitals: recentVitals.length > 1 ? recentVitals.slice(1).reverse() : [],
    };

    const estimationResult = await estimateHealthMetricsAction(aiInput);
    if (estimationResult.error || !estimationResult.data) throw new Error(estimationResult.error || 'AI estimation failed.');
    const estimation = estimationResult.data;

    await addDoc(collection(firestore, `users/${patientId}/estimations`), {
      ...estimation,
      timestamp: serverTimestamp(),
    });
    
    if (estimation.estimatedBpCategory === 'High' || estimation.glucoseTrend === 'Risky') {
      let message = '';
      if (estimation.glucoseTrend === 'Risky') message += 'Risky glucose trend detected by AI. ';
      if (estimation.estimatedBpCategory === 'High') message += 'High blood pressure category estimated by AI.';
      
      const alertSeverity = 'High';
      
      const newAlert: Omit<Alert, 'id'|'timestamp'> = {
        patientId: patientId,
        patientName: patientProfile.displayName,
        severity: alertSeverity,
        message: message.trim(),
        isRead: false,
      };

      await addDoc(collection(firestore, 'alerts'), {
        ...newAlert,
        timestamp: serverTimestamp(),
      });

      await sendTelegramAlert(patientProfile.displayName, alertSeverity, message.trim());
    }

    return { data: `Vitals uploaded and analyzed successfully.` };

  } catch (e: any) {
    console.error("Error in triggerVitalsScanAndAnalysis:", e);
    return { error: e.message || 'An unknown error occurred during the vitals scan process.' };
  }
}
