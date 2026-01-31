import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function PatientAppointmentsPage() {
  return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Appointments</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold tracking-tight">
                Appointments Not Available
            </h3>
            <p className="text-sm text-muted-foreground">
                This feature is not currently enabled. Please use the AI Chat for questions.
            </p>
            </div>
        </div>
    </main>
  );
}
