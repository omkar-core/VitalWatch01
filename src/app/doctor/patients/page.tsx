"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import { patients } from "@/lib/data";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function DoctorPatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "Critical":
        return "bg-red-500";
      case "Needs Review":
        return "bg-yellow-500";
      case "Stable":
        return "bg-green-500";
    }
  };

  return (
    <div className="grid md:grid-cols-[300px_1fr] flex-1 h-[calc(100vh-60px)]">
      <div className="border-r bg-card/50">
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-theme(spacing.32))]">
          <div className="flex flex-col gap-2 p-2 pt-0">
            {patients.map((patient) => (
              <button
                key={patient.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  selectedPatient.id === patient.id && "bg-accent"
                )}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={patient.avatarUrl}
                                alt={patient.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                                data-ai-hint={patient.avatarHint}
                            />
                            <span className={cn("absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-background", getStatusColor(patient.status))} />
                        </div>
                        <div className="font-semibold">{patient.name}</div>
                    </div>
                  <div className="text-xs text-muted-foreground">{patient.lastSeen}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {patient.age} y/o {patient.gender}
                </div>
                 <div className="line-clamp-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">Symptoms: </span> {patient.symptoms}
                </div>
                <Badge variant={patient.status === 'Critical' ? 'destructive' : 'secondary'}>{patient.status}</Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
        {selectedPatient && (
          <ScrollArea className="h-full">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">{selectedPatient.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{selectedPatient.age} y/o {selectedPatient.gender}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Vitals Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VitalsChart data={selectedPatient.vitals} />
                    </CardContent>
                </Card>
                <AiAssistant patient={selectedPatient} />
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
}
