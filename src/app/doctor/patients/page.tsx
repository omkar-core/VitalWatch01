"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/types";
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
import { useFirestore } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  
  const patientsQuery = query(collection(firestore, 'users'), where('role', '==', 'patient'));
  const { data: allPatients, loading } = useCollection<UserProfile>(patientsQuery);

  const filteredPatients = allPatients?.filter(patient =>
    patient.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Patient Management</CardTitle>
                    <CardDescription>Search, filter, and manage all your patients.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-10 w-full max-w-sm" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                 </CardContent>
            </Card>
        </main>
    )
  }

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
                    <Input placeholder="Search patients by name..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Risk Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPatients.map((patient) => (
                        <TableRow key={patient.uid}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Image src={patient.avatarUrl || `https://i.pravatar.cc/150?u=${patient.uid}`} alt={patient.displayName} width={32} height={32} className="rounded-full object-cover" />
                                    {patient.displayName}
                                </div>
                            </TableCell>
                            <TableCell>{patient.conditions?.join(', ')}</TableCell>
                            <TableCell>
                                <Badge variant={patient.status === 'Critical' ? 'destructive' : patient.status === 'Needs Review' ? 'secondary' : 'default'}
                                className={patient.status === 'Stable' ? 'bg-green-500 hover:bg-green-500/80' : ''}>
                                    {patient.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{patient.lastSeen}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/doctor/patients/${patient.uid}`}>View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
