"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || "doctor";
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const role = formData.get("role");

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      router.push(`/${role}`);
    }, 1500);
  };

  return (
    <Tabs defaultValue={initialRole} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="patient">Patient</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit}>
        <TabsContent value="doctor">
            <input type="hidden" name="role" value="doctor" />
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="doc-name">Full Name</Label>
                    <Input id="doc-name" name="name" placeholder="Dr. John Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doc-license">Medical License Number</Label>
                    <Input id="doc-license" name="license" placeholder="MCI123456" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="doc-clinic">Clinic/Hospital Name</Label>
                    <Input id="doc-clinic" name="clinic" placeholder="City General Hospital" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doc-email">Email</Label>
                    <Input id="doc-email" name="email" type="email" placeholder="doctor@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doc-password">Password</Label>
                    <Input id="doc-password" name="password" type="password" required />
                </div>
            </div>
        </TabsContent>
        <TabsContent value="patient">
             <input type="hidden" name="role" value="patient" />
             <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="patient-name">Full Name</Label>
                        <Input id="patient-name" name="name" placeholder="Jane Smith" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="patient-age">Age</Label>
                        <Input id="patient-age" name="age" type="number" placeholder="45" required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="patient-gender">Gender</Label>
                    <Select name="gender" required>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                             <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <Input id="patient-phone" name="phone" type="tel" placeholder="+91..." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="patient-email">Email (Optional)</Label>
                    <Input id="patient-email" name="email" type="email" placeholder="patient@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" name="password" type="password" required />
                </div>
            </div>
        </TabsContent>
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </Tabs>
  );
}
