import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users, devices, patients } from "@/lib/data";
import { Users, TabletSmartphone, Activity } from "lucide-react";

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
  ];


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Overview Dashboard</h1>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to the Admin Portal
          </h3>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to manage users, devices, and system settings.
          </p>
        </div>
      </div>
    </main>
  );
}
