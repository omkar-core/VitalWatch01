
import { notFound } from 'next/navigation';
import { getPatient, getVitals, getAlerts } from '@/lib/data-access';
import { PatientDetailView } from './patient-detail-view';

export default async function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
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
