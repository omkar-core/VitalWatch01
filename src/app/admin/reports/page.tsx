import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown } from "lucide-react";

export default function AdminReportsPage() {
  const reportGroups = [
    {
      title: "Clinical Reports",
      reports: ["Population Health Summary", "Outcome Metrics", "Doctor Performance", "Patient Compliance"],
    },
    {
      title: "Operational Reports",
      reports: ["Device Utilization", "System Uptime", "Alert Response Times", "Data Quality Report"],
    },
    {
      title: "Financial Reports",
      reports: ["Cost per Patient", "Resource Utilization", "ROI Analysis"],
    },
    {
        title: "Regulatory Reports",
        reports: ["Data Privacy Compliance", "Clinical Audit Trail", "Incident Reports"]
    }
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Reports</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown /> Generate Reports
          </CardTitle>
          <CardDescription>
            Create and export detailed reports for clinical, operational, and financial analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select a report type..." />
              </SelectTrigger>
              <SelectContent>
                {reportGroups.map((group) => (
                  <div key={group.title}>
                    <Label className="px-2 text-xs font-bold text-muted-foreground">{group.title}</Label>
                    {group.reports.map((report) => (
                      <SelectItem key={report} value={report.toLowerCase().replace(/ /g, "-")}>
                        {report}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select defaultValue="30d">
              <SelectTrigger id="date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel/CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-4">
             <Button className="w-full md:w-auto">Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
