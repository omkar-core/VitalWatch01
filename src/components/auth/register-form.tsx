"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUpWithEmail } from "@/firebase/auth/auth-service";

const doctorSchema = z.object({
    role: z.literal('doctor'),
    name: z.string().min(2, "Name is required"),
    license: z.string().min(5, "A valid medical license is required"),
    clinic: z.string().min(3, "Clinic name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const patientSchema = z.object({
    role: z.literal('patient'),
    name: z.string().min(2, "Name is required"),
    age: z.coerce.number().min(1, "Age is required"),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().min(10, "A valid phone number is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const formSchema = z.discriminatedUnion("role", [doctorSchema, patientSchema]);

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || "doctor";

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: activeTab },
  });

  const onTabChange = (value: string) => {
    const newRole = value as UserRole;
    setActiveTab(newRole);
    form.reset();
    form.setValue("role", newRole);
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { error } = await signUpWithEmail(values);
      if (error) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error,
        });
      } else {
        toast({
            title: "Registration Successful",
            description: "Welcome! You will be redirected shortly."
        });
        router.refresh();
      }
    });
  };

  return (
    <Tabs defaultValue={initialRole} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="patient">Patient</TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="doctor" forceMount={activeTab === 'doctor'} className={activeTab === 'doctor' ? '' : 'hidden'}>
                <div className="space-y-3 pt-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Dr. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="license" render={({ field }) => (
                        <FormItem><FormLabel>Medical License Number</FormLabel><FormControl><Input placeholder="MCI123456" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="clinic" render={({ field }) => (
                        <FormItem><FormLabel>Clinic/Hospital Name</FormLabel><FormControl><Input placeholder="City General Hospital" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="doctor@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </TabsContent>
            <TabsContent value="patient" forceMount={activeTab === 'patient'} className={activeTab === 'patient' ? '' : 'hidden'}>
                 <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="45" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem><FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="patient@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </TabsContent>
            <Button type="submit" className="w-full mt-6" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Creating Account..." : "Register"}
            </Button>
        </form>
      </Form>
    </Tabs>
  );
}
