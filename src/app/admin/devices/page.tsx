'use client';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR from 'swr';
import type { PatientProfile } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());


export default function AdminDevicesPage() {
  const { data: patientProfiles, error, isLoading } = useSWR<PatientProfile[]>('/api/patients', fetcher);

  const devices = patientProfiles?.map(profile => ({
      id: profile.device_id,
      assignedTo: profile.name,
      patientId: profile.patient_id,
      isActive: profile.is_active,
    })) || [];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Device Management</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="default" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                    Add New Device
                </span>
                </Button>
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Registered Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {!isLoading && error && <p className="text-destructive">Error: {error.message}</p>}
            {!isLoading && !error && (
              <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To Patient</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devices.map((device) => (
                    <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.id}</TableCell>
                        <TableCell>
                        <Badge variant={device.isActive ? 'default' : 'secondary'}
                            className={device.isActive ? 'bg-green-600 hover:bg-green-600/80' : ''}
                        >{device.isActive ? 'Active' : 'Inactive'}</Badge>
                        </TableCell>
                        <TableCell>{device.assignedTo}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Patient</DropdownMenuItem>
                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive hover:text-destructive-foreground">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
            </CardContent>
        </Card>
    </main>
  );
}
