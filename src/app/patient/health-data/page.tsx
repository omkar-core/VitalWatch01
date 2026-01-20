import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patients } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function PatientHealthDataPage() {
  const patient = patients[1]; // Mock data for Jane Smith

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">My Health Data</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
            <VitalsChart data={patient.vitals} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Vitals History</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Heart Rate (bpm)</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>SPO2 (%)</TableHead>
                  <TableHead>Temperature (°C)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.vitals.slice().reverse().map((vital) => (
                  <TableRow key={vital.time}>
                    <TableCell>{vital.time}</TableCell>
                    <TableCell>{vital["Heart Rate"]}</TableCell>
                    <TableCell>{vital["Blood Pressure"]}</TableCell>
                    <TableCell>{vital["SPO2"]}</TableCell>
                    <TableCell>{vital["Temperature"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
