import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patients } from "@/lib/data";
import { HeartPulse, Thermometer, Droplets, Wind } from "lucide-react";

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
        <Card>
            <CardHeader>
                <CardTitle>Health Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <VitalsChart data={patient.vitals} />
            </CardContent>
        </Card>
    </main>
  );
}
