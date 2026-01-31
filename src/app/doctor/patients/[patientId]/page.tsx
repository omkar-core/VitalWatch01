
import { notFound } from 'next/navigation';
import type { PatientProfile, HealthVital, AlertHistory } from "@/lib/types";
import { PatientDetailView } from './patient-detail-view';

async function getPatient(patientId: string): Promise<PatientProfile | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/patients/${patientId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getVitals(deviceId: string): Promise<HealthVital[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vitals/history/${deviceId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getAlerts(patientId: string): Promise<AlertHistory[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alerts?patientId=${patientId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

type PatientDetailPageProps = {
  params: { patientId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { patientId } = params;

  const patient = await getPatient(patientId);

  if (!patient) {
    notFound();
  }
  
  const [vitals, alerts] = await Promise.all([
    getVitals(patient.device_id),
    getAlerts(patient.patient_id)
  ]);
  
  return <PatientDetailView patient={patient} vitals={vitals} alerts={alerts} />;
}
