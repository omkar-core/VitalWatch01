import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { patients } from "@/lib/data";

export default function DoctorAnalyticsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics & Reports</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Analytics Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed reports and patient population analytics will be available here.
          </p>
        </div>
      </div>
    </main>
  );
}
