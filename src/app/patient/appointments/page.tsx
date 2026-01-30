'use client';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase/auth/use-user";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore } from "@/firebase/provider";
import type { Appointment } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


export default function PatientAppointmentsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const appointmentsQuery = user ? query(collection(firestore, 'appointments'), where('patientId', '==', user.uid)) : null;
  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const loading = userLoading || appointmentsLoading;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Appointments</h1>
        <Button>Request New Appointment</Button>
      </div>
       <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                       <Skeleton className="h-24 w-full" />
                    ): appointments && appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((appt, i) => (
                                <div key={i} className="p-4 rounded-lg border bg-card">
                                    <p className="font-semibold">{appt.type} with {appt.doctorName}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <div className="mt-2">
                                        <Button variant="outline" size="sm">Reschedule</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">You have no upcoming appointments.</p>
                    )}
                </CardContent>
            </Card>
            <Card className="flex justify-center items-center">
                <Calendar
                    mode="single"
                    className="p-0"
                />
            </Card>
       </div>
    </main>
  );
}
