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
import { MoreHorizontal, PlusCircle, Upload, Search, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/lib/types";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  
  const [usersSnapshot, loading, error] = useCollection(
    firestore ? collection(firestore, 'users') : null
  );

  const allUsers = usersSnapshot?.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)) || [];

  const filteredUsers = allUsers.filter(user =>
    (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const doctors = filteredUsers.filter(u => u.role === 'doctor');
  const patients = filteredUsers.filter(u => u.role === 'patient');
  const staff = filteredUsers.filter(u => u.role === 'admin');


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
                        <TabsTrigger value="doctors">Doctors ({loading ? '...' : doctors.length})</TabsTrigger>
                        <TabsTrigger value="patients">Patients ({loading ? '...' : patients.length})</TabsTrigger>
                        <TabsTrigger value="staff">Staff ({loading ? '...' : staff.length})</TabsTrigger>
                    </TabsList>
                     <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading && (
                      <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    )}
                    {!loading && error && <p className="text-destructive">Error: {error.message}</p>}
                    {!loading && !error && (
                        <>
                            <TabsContent value="doctors">
                                <UserTable users={doctors} />
                            </TabsContent>
                            <TabsContent value="patients">
                                <UserTable users={patients} />
                            </TabsContent>
                            <TabsContent value="staff">
                                 <UserTable users={staff} />
                            </TabsContent>
                        </>
                    )}
                </CardContent>
            </Tabs>
        </Card>
    </main>
  );
}


function UserTable({ users }: { users: UserProfile[] }) {
    if (users.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">No users in this category.</div>
    }

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
                <TableRow key={user.uid}>
                <TableCell className="font-medium flex items-center gap-2">
                    <Image src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName || 'user avatar'} width={32} height={32} className="rounded-full object-cover" />
                    {user.displayName}
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
