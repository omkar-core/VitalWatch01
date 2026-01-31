'use client';

import { useParams } from 'next/navigation';
import { PatientDetailView } from './patient-detail-view';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * This page component is now a client component to reliably get the dynamic
 * route parameter (`patientId`) without causing build errors. It acts as a simple
 * wrapper that extracts the ID and passes it to the main view component.
 */
export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;

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

  return <PatientDetailView patientId={patientId} />;
}
