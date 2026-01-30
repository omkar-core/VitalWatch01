'use client';

import { useMemo } from 'react';
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import type { Vital } from '@/lib/types';
import { mockPatients, mockVitals } from "@/lib/mock-data";
import { format } from 'date-fns';

export default function PatientHealthDataPage() {
    const patient = mockPatients[0];
    const vitals = mockVitals[patient.uid] || [];
    const loading = false;

    const chartVitals = useMemo(() => 
        vitals?.map(v => ({
            ...v,
            time: v.timestamp?.toDate ? format(v.timestamp.toDate(), 'p') : 'N/A'
        })).reverse() || [],
    [vitals]);

    const glucoseSummary = useMemo(() => {
      if (!vitals) return { sum: 0, highest: 0, lowest: Infinity, inTarget: 0, aboveTarget: 0, belowTarget: 0 };
      return vitals.reduce((acc, vital) => {
          acc.sum += vital.Glucose;
          if (vital.Glucose > acc.highest) acc.highest = vital.Glucose;
          if (vital.Glucose < acc.lowest) acc.lowest = vital.Glucose;
          if (vital.Glucose >= 70 && vital.Glucose <= 180) acc.inTarget++;
          else if (vital.Glucose > 180) acc.aboveTarget++;
          else acc.belowTarget++;
          return acc;
      }, { sum: 0, highest: 0, lowest: Infinity, inTarget: 0, aboveTarget: 0, belowTarget: 0 });
    }, [vitals]);

    const totalVitals = vitals?.length || 0;
    const averageGlucose = totalVitals > 0 ? Math.round(glucoseSummary.sum / totalVitals) : 0;
    const timeInTarget = totalVitals > 0 ? Math.round((glucoseSummary.inTarget / totalVitals) * 100) : 0;
    const timeAboveTarget = totalVitals > 0 ? Math.round((glucoseSummary.aboveTarget / totalVitals) * 100) : 0;
    const timeBelowTarget = totalVitals > 0 ? Math.round((glucoseSummary.belowTarget / totalVitals) * 100) : 0;

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
                    <VitalsChart data={chartVitals} dataKey1="Glucose" label1="Glucose (mg/dL)" color1="hsl(var(--chart-1))" />
                </CardContent>
            </Card>
             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold">{averageGlucose} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                     <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Highest</p>
                        <p className="text-2xl font-bold">{glucoseSummary.highest} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                     <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Lowest</p>
                        <p className="text-2xl font-bold">{isFinite(glucoseSummary.lowest) ? glucoseSummary.lowest : 0} <span className="text-sm font-normal">mg/dL</span></p>
                    </div>
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-center mb-2">Time in Range</h4>
                        <div className="flex w-full h-4 rounded-full overflow-hidden">
                            <div className="bg-destructive" style={{ width: `${timeAboveTarget}%` }} title={`Above Target: ${timeAboveTarget}%`}></div>
                            <div className="bg-green-500" style={{ width: `${timeInTarget}%` }} title={`In Target: ${timeInTarget}%`}></div>
                            <div className="bg-yellow-500" style={{ width: `${timeBelowTarget}%` }} title={`Below Target: ${timeBelowTarget}%`}></div>
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
                    <VitalsChart data={chartVitals} dataKey1="Systolic" label1="Systolic" color1="hsl(var(--chart-2))" dataKey2="Diastolic" label2="Diastolic" color2="hsl(var(--chart-3))"/>
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
                {vitals?.map((vital) => (
                  <TableRow key={vital.id}>
                    <TableCell>{vital.timestamp?.toDate ? format(vital.timestamp.toDate(), 'PPpp') : 'N/A'}</TableCell>
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
