import { PatientDetailView } from './patient-detail-view';

/**
 * This is the page component for the patient detail view.
 * It's a server component that renders the client component responsible for data fetching.
 * It no longer needs to handle params directly, as the client component uses a hook.
 */
export default function PatientDetailPage() {
  return <PatientDetailView />;
}
