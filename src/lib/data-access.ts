import type { PatientProfile, HealthVital, AlertHistory } from "@/lib/types";

// This file is being created to isolate data-fetching logic and potentially
// help with a persistent TypeScript build error in the PatientDetailPage.

export async function getPatient(patientId: string): Promise<PatientProfile | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/patients/${patientId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function getVitals(deviceId: string): Promise<HealthVital[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vitals/history/${deviceId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function getAlerts(patientId: string): Promise<AlertHistory[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alerts?patientId=${patientId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}
