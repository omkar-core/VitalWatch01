import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, devices, patients } from "@/lib/data";
import { Users, TabletSmartphone, Activity, HardDrive, BarChart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function AdminPage() {
    const summaryCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Registered Devices",
      value: devices.length,
      icon: <TabletSmartphone className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Monitored Patients",
      value: patients.length,
      icon: <Activity className="h-6 w-6 text-muted-foreground" />,
    },
     {
      title: "System Status",
      value: "Operational",
      icon: <HardDrive className="h-6 w-6 text-green-500" />,
    },
  ];


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Overview Dashboard</h1>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Dr. Evelyn Reed</TableCell>
                            <TableCell>Acknowledged critical alert for John Doe</TableCell>
                            <TableCell>5m ago</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>admin@vital.watch</TableCell>
                            <TableCell>Added new device 'dev-spo2-06'</TableCell>
                            <TableCell>1h ago</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>Jane Smith</TableCell>
                            <TableCell>Logged in</TableCell>
                            <TableCell>2h ago</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
             <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button asChild><Link href="/admin/users">Manage Users</Link></Button>
                <Button asChild variant="secondary"><Link href="/admin/devices">Manage Devices</Link></Button>
                <Button asChild variant="secondary"><Link href="/admin/reports">Generate Reports</Link></Button>
                <Button asChild variant="outline"><Link href="/admin/configuration">System Configuration</Link></Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
