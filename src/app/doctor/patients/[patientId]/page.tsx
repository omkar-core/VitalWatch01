import { PatientDetailView } from './patient-detail-view';

type PatientDetailPageProps = {
  params: {
    patientId: string;
  };
};

/**
 * This is the page component for the patient detail view.
 * It's a server component that receives the patientId from the URL params
 * and passes it down to the client component responsible for data fetching.
 */
export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  return <PatientDetailView patientId={params.patientId} />;
}
