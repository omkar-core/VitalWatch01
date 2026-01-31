import { PatientDetailView } from './patient-detail-view';

// This is now a simple, non-async component.
// It only extracts the patientId and passes it to the client component.
export default function PatientDetailPage({
  params,
}: {
  params: { patientId: string };
}) {
  return <PatientDetailView patientId={params.patientId} />;
}
