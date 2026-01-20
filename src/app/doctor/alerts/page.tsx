import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts } from "@/lib/data";
import { AlertTriangle, Check } from "lucide-react";

export default function DoctorAlertsPage() {
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Alerts & Notifications</h1>
      </div>
      <div
        className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className={!alert.isRead ? 'bg-secondary/50' : ''}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${getSeverityClass(alert.severity)}`} />
                    <span className={`font-medium ${getSeverityClass(alert.severity)}`}>{alert.severity}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{alert.patientName}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.timestamp}</TableCell>
                <TableCell>
                  <Badge variant={alert.isRead ? "outline" : "default"}>
                    {alert.isRead ? "Read" : "Unread"}
                  </Badge>
                </TableCell>
                <TableCell>
                    {!alert.isRead && (
                         <Button variant="outline" size="sm">
                            <Check className="mr-2 h-4 w-4"/>
                            Mark as Read
                         </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
