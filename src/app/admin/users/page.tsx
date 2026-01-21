"use client";
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
import { MoreHorizontal, PlusCircle, Upload } from "lucide-react";
import { users } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Metadata } from 'next';
import type { User } from "@/lib/types";

export default function AdminUsersPage() {

    useEffect(() => {
        document.title = "User Management - Admin Portal | VitalWatch";
    }, []);

  const allUsers = users;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctors = filteredUsers.filter(u => u.role === 'doctor');
  const patients = filteredUsers.filter(u => u.role === 'patient');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">User Management</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Upload className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                Import from CSV
              </span>
            </Button>
            <Button size="sm" variant="default" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                Add New User
              </span>
            </Button>
          </div>
      </div>
        <Card>
            <Tabs defaultValue="doctors">
                <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
                        <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                    </TabsList>
                     <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <TabsContent value="doctors">
                        <UserTable users={doctors} />
                    </TabsContent>
                    <TabsContent value="patients">
                         <UserTable users={patients} />
                    </TabsContent>
                     <TabsContent value="staff">
                        <div className="text-center py-12 text-muted-foreground">
                            Staff management coming soon.
                        </div>
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    </main>
  );
}


function UserTable({ users }: { users: User[] }) {
    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                <TableCell className="font-medium flex items-center gap-2">
                    <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="rounded-full object-cover" data-ai-hint={user.avatarHint} />
                    {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {user.role === 'doctor' && <DropdownMenuItem>Assign Patients</DropdownMenuItem>}
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:text-destructive-foreground">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}
