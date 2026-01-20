import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { patients } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Health Data - VitalWatch',
  description: 'View and track your health data trends over time.',
};

export default function PatientHealthDataPage() {
  const patient = patients[1]; // Mock data for Jane Smith

  const glucoseSummary = {
    average: 185,
    highest: 380,
    lowest: 95,
    timeInTarget: 45,
    timeAboveTarget: 48,
    timeBelowTarget: 7,
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Health Data</h1>
        <Button variant="outline"><Download className="mr-2"/>Export to PDF</Button>
      </div>

      <Tabs defaultValue="glucose">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="glucose">Glucose Trends</TabsTrigger>
            <TabsTrigger value="bp">Blood Pressure Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="glucose">
            <Card>
                <CardHeader>
                    <CardTitle>Glucose Trend (Last 7 Days)</CardTitle>
                    <CardDescription>Target Range: 70-180 mg/dL</CardDescription>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={patient.vitals} dataKey1="Glucose" label1="Glucose (mg/dL)" color1="hsl(var(--chart-1))" />
                </CardContent>
            </Card>
             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold">{glucoseSummary.average} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                     <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Highest</p>
                        <p className="text-2xl font-bold">{glucoseSummary.highest} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                     <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Lowest</p>
                        <p className="text-2xl font-bold">{glucoseSummary.lowest} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-center mb-2">Time in Range</h4>
                        <div className="flex w-full h-4 rounded-full overflow-hidden">
                            <div className="bg-destructive" style={{ width: `${glucoseSummary.timeAboveTarget}%` }} title={`Above Target: ${glucoseSummary.timeAboveTarget}%`}></div>
                            <div className="bg-green-500" style={{ width: `${glucoseSummary.timeInTarget}%` }} title={`In Target: ${glucoseSummary.timeInTarget}%`}></div>
                            <div className="bg-yellow-500" style={{ width: `${glucoseSummary.timeBelowTarget}%` }} title={`Below Target: ${glucoseSummary.timeBelowTarget}%`}></div>
                        </div>
                         <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>High</span>
                            <span>In Range</span>
                            <span>Low</span>
                        </div>
                    </div>
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="bp">
             <Card>
                <CardHeader>
                    <CardTitle>Blood Pressure Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <VitalsChart data={patient.vitals} dataKey1="Systolic" label1="Systolic" color1="hsl(var(--chart-2))" dataKey2="Diastolic" label2="Diastolic" color2="hsl(var(--chart-3))"/>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
            <CardTitle>Vitals History</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Glucose (mg/dL)</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>Heart Rate (bpm)</TableHead>
                  <TableHead>SPO2 (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.vitals.slice().reverse().map((vital) => (
                  <TableRow key={vital.time}>
                    <TableCell>{vital.time}</TableCell>
                    <TableCell>{vital["Glucose"]}</TableCell>
                    <TableCell>{`${vital["Systolic"]}/${vital["Diastolic"]}`}</TableCell>
                    <TableCell>{vital["Heart Rate"]}</TableCell>
                    <TableCell>{vital["SPO2"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
