import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { patients } from "@/lib/data";
import { BarChart, LineChart, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function DoctorAnalyticsPage() {
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
            <div>
              <h4 className="font-semibold text-sm mb-2">Risk Level Distribution</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center"><span className="text-sm">Normal</span><span className="text-sm font-bold">317 (65%)</span></div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between items-center"><span className="text-sm">Borderline</span><span className="text-sm font-bold">122 (25%)</span></div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
               <div className="space-y-1 mt-2">
                <div className="flex justify-between items-center"><span className="text-sm">High Risk</span><span className="text-sm font-bold">48 (10%)</span></div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{width: '10%'}}></div>
                </div>
              </div>
            </div>
             <div>
              <h4 className="font-semibold text-sm mb-2">Control Status</h4>
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
            <CardTitle className="flex items-center gap-2"><LineChart /> Trend Analysis (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Alert Frequency</h4>
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
