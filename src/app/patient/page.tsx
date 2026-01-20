import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { patients } from "@/lib/data";
import { HeartPulse, Droplets, Calendar, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PatientPage() {
  const patient = patients[0]; // Mock data for Ramaiah S.
  const latestVitals = patient.vitals[patient.vitals.length - 1];

  const vitalCards = [
    {
      title: "Glucose",
      value: `${latestVitals["Glucose"]} mg/dL`,
      status: "Critical",
      icon: <HeartPulse className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Blood Pressure",
      value: `${latestVitals["Systolic"]}/${latestVitals["Diastolic"]}`,
      status: "High",
      icon: <Droplets className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Heart Rate",
      value: `${latestVitals["Heart Rate"]} BPM`,
      status: "Normal",
      icon: <HeartPulse className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="font-headline text-2xl font-bold">Welcome, {patient.name.split(' ')[0]}!</h1>
        
        <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Active Alerts & Advice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="font-bold">Your glucose is dangerously high!</p>
                <div>
                    <h4 className="font-semibold">What to do NOW:</h4>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                        <li>Drink 2 glasses of water</li>
                        <li>Do NOT eat anything for the next 2 hours</li>
                        <li>Rest and avoid physical activity</li>
                        <li className="font-semibold">Your doctor has been notified and will call you shortly.</li>
                    </ul>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="destructive">I Need Help Now</Button>
                    <Button variant="outline">Mark as Read</Button>
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
            {vitalCards.map((vital) => (
                <Card key={vital.title}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>{vital.title}</span>
                            {vital.icon}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{vital.value}</div>
                        <Badge variant={vital.status === 'Critical' || vital.status === 'High' ? 'destructive' : 'default'} className={vital.status === 'Normal' ? 'bg-green-500' : ''}>{vital.status}</Badge>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Health Trends</CardTitle>
                    <CardDescription>Your glucose levels over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={patient.vitals} dataKey1="Glucose" label1="Glucose" color1="hsl(var(--chart-1))" />
                    <Button variant="link" className="p-0 h-auto mt-2 text-sm as-child">
                      <Link href="/patient/health-data">View Detailed Trends →</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageCircle /> Medication Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm">Upcoming:</p>
                      <p className="text-muted-foreground">Metformin 500mg - Due in 30 minutes (3:00 PM)</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm">Mark as Taken</Button>
                        <Button size="sm" variant="outline">Snooze</Button>
                      </div>
                    </div>
                     <div>
                      <p className="font-semibold text-sm flex items-center gap-2"><CheckCircle className="text-green-500"/>Taken:</p>
                      <p className="text-muted-foreground">Amlodipine 5mg - (8:00 AM)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar/> Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Dr. Meera</p>
                  <p className="text-sm text-muted-foreground">25 Jan 2025, 10:00 AM</p>
                  <p className="text-sm text-muted-foreground">Tumkur PHC</p>
                  <Button variant="secondary" size="sm" className="mt-2 w-full as-child"><Link href="/patient/appointments">Manage Appointments</Link></Button>
                </CardContent>
              </Card>
          </div>
        </div>
    </main>
  );
}
