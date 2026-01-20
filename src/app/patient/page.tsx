import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { patients } from "@/lib/data";
import { HeartPulse, Thermometer, Droplets, Wind, Calendar, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientPage() {
  const patient = patients[1]; // Mock data for Jane Smith
  const latestVitals = patient.vitals[patient.vitals.length - 1];

  const vitalCards = [
    {
      title: "Heart Rate",
      value: `${latestVitals["Heart Rate"]} bpm`,
      icon: <HeartPulse className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Blood Pressure",
      value: latestVitals["Blood Pressure"],
      icon: <Droplets className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "SPO2",
      value: `${latestVitals["SPO2"]}%`,
      icon: <Wind className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Temperature",
      value: `${latestVitals["Temperature"]} °C`,
      icon: <Thermometer className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="font-headline text-2xl font-bold">Welcome, {patient.name.split(' ')[0]}!</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {vitalCards.map((vital) => (
                <Card key={vital.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{vital.title}</CardTitle>
                        {vital.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vital.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Health Trends</CardTitle>
                    <CardDescription>Your vitals over the last few hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={patient.vitals} />
                </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info /> Doctor's Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">"Your levels look stable, Jane. Keep up the great work with your diet and exercise. Remember to take your evening medication."</p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-sm"><Link href="/patient/alerts">View all advice</Link></Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Calendar/> Upcoming Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Virtual Check-up with Dr. Reed</p>
                  <p className="text-sm text-muted-foreground">Tomorrow at 10:30 AM</p>
                  <Button variant="secondary" size="sm" className="mt-2 w-full"><Link href="/patient/appointments">Manage Appointments</Link></Button>
                </CardContent>
              </Card>
          </div>
        </div>
    </main>
  );
}
