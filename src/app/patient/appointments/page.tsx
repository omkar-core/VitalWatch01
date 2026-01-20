import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientAppointmentsPage() {
    const appointments = [
        {
            doctor: "Dr. Evelyn Reed",
            date: "2024-08-15",
            time: "10:30 AM",
            type: "Virtual Check-up"
        }
    ]
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
                    {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((appt, i) => (
                                <div key={i} className="p-4 rounded-lg border bg-card">
                                    <p className="font-semibold">{appt.type} with {appt.doctor}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}</p>
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
