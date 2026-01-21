"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VitalsChart } from "@/components/dashboard/vitals-chart";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import { patients } from "@/lib/data";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";


export default function DoctorPatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>Search, filter, and manage all your patients.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search patients..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Risk: All</Button>
                    <Button variant="outline">Condition: All</Button>
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Glucose</TableHead>
                    <TableHead>BP</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient) => (
                    <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Image src={patient.avatarUrl} alt={patient.name} width={32} height={32} className="rounded-full object-cover" data-ai-hint={patient.avatarHint} />
                                {patient.name}
                            </div>
                        </TableCell>
                        <TableCell>{patient.conditions.join(', ')}</TableCell>
                        <TableCell>
                            <span className={patient.vitals[patient.vitals.length-1]['Heart Rate'] > 180 ? 'text-destructive font-bold' : ''}>
                                {patient.vitals[patient.vitals.length-1]['Heart Rate']} mg/dL
                            </span>
                        </TableCell>
                         <TableCell>{patient.vitals[patient.vitals.length-1]['Blood Pressure']}</TableCell>
                        <TableCell>
                            <Badge variant={patient.status === 'Critical' ? 'destructive' : patient.status === 'Needs Review' ? 'secondary' : 'default'}
                            className={patient.status === 'Stable' ? 'bg-green-500' : ''}>
                                {patient.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{patient.lastSeen}</TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/doctor/patients/${patient.id}`}>View</Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
