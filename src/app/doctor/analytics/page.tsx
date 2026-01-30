'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileDown, LineChartIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';
import type { PatientProfile, AlertHistory } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DoctorAnalyticsPage() {
  const { data: patients, isLoading: patientsLoading } = useSWR<PatientProfile[]>('/api/patients', fetcher);
  const { data: alerts, isLoading: alertsLoading } = useSWR<AlertHistory[]>('/api/alerts', fetcher);

  const loading = patientsLoading || alertsLoading;

  const getStatus = (patientId: string) => {
    const patientAlerts = alerts?.filter(a => a.patient_id === patientId);
    if (patientAlerts?.some(a => a.severity === 'Critical')) return 'Critical';
    if (patientAlerts?.some(a => a.severity === 'High')) return 'Needs Review';
    return 'Stable';
  };

  const riskDistribution = {
    stable: patients?.filter(p => getStatus(p.patient_id) === 'Stable').length || 0,
    needsReview: patients?.filter(p => getStatus(p.patient_id) === 'Needs Review').length || 0,
    critical: patients?.filter(p => getStatus(p.patient_id) === 'Critical').length || 0,
  };

  const totalPatients = patients?.length || 1; 

  const stablePercent = Math.round((riskDistribution.stable / totalPatients) * 100);
  const needsReviewPercent = Math.round((riskDistribution.needsReview / totalPatients) * 100);
  const criticalPercent = Math.round((riskDistribution.critical / totalPatients) * 100);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Analytics & Population Health</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Patient Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading ? <Skeleton className="h-48 w-full"/> : (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Risk Level Distribution</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center"><span className="text-sm">Stable</span><span className="text-sm font-bold">{riskDistribution.stable} ({stablePercent}%)</span></div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${stablePercent}%`}}></div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center"><span className="text-sm">Needs Review</span><span className="text-sm font-bold">{riskDistribution.needsReview} ({needsReviewPercent}%)</span></div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: `${needsReviewPercent}%`}}></div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center"><span className="text-sm">Critical</span><span className="text-sm font-bold">{riskDistribution.critical} ({criticalPercent}%)</span></div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{width: `${criticalPercent}%`}}></div>
                    </div>
                  </div>
                </div>
             )}
             <div>
              <h4 className="font-semibold text-sm mb-2 mt-4">Control Status (Mock Data)</h4>
               <ul className="list-disc list-inside text-sm text-muted-foreground">
                 <li>Well Controlled: 60%</li>
                 <li>Moderately Controlled: 28%</li>
                 <li>Poorly Controlled: 12%</li>
               </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChartIcon /> Trend Analysis (Mock Data)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Alert Frequency (Last 30 Days)</h4>
              <p className="text-2xl font-bold">37.8% <span className="text-sm font-normal text-green-500">reduction</span></p>
              <p className="text-xs text-muted-foreground">Overall alert frequency has decreased in the last 4 weeks.</p>
            </div>
             <div>
              <h4 className="font-semibold text-sm mb-2">Outcomes & Impact</h4>
               <ul className="list-disc list-inside text-sm text-muted-foreground">
                 <li>Emergency hospitalizations avoided: 18</li>
                 <li>Average HbA1c improvement: 0.7%</li>
                 <li>BP control rate: 45% → 68%</li>
                 <li>Patient engagement: 87%</li>
               </ul>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileDown /> Generate Reports</CardTitle>
            <CardDescription>Create and export detailed reports for your patient population.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select defaultValue="monthly-summary">
                  <SelectTrigger id="report-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="monthly-summary">Monthly Summary</SelectItem>
                      <SelectItem value="patient-deep-dive">Patient Deep Dive</SelectItem>
                      <SelectItem value="alerts-analysis">Alerts Analysis</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select defaultValue="30d">
                  <SelectTrigger id="date-range"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select defaultValue="pdf">
                  <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto">Generate Report</Button>
          </CardContent>
        </Card>

    </main>
  );
}
