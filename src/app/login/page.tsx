import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalWatchLogo } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";
import { mockDoctor, mockPatient } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";


export const metadata: Metadata = {
  title: "Login - VitalWatch",
  description: "Access your VitalWatch account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
            <VitalWatchLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-foreground">VitalWatch</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Access</CardTitle>
            <CardDescription>Enter your credentials to access your portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
                New user?{" "}
                <Link href="/register" className="underline">
                    Sign up here
                </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 border-dashed">
            <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2"><Code size={20}/> Mock User Credentials</CardTitle>
                <CardDescription>First, use the <Link href="/register" className="font-semibold underline">registration page</Link> to create these users, then log in with their credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="doctor">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="doctor">Doctor</TabsTrigger>
                        <TabsTrigger value="patient">Patient</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 text-sm font-mono bg-muted/50 p-4 rounded-md">
                        <TabsContent value="doctor">
                            <p><strong className="font-sans font-medium text-muted-foreground">Email:</strong> {mockDoctor.email}</p>
                            <p><strong className="font-sans font-medium text-muted-foreground">Password:</strong> {mockDoctor.password}</p>
                        </TabsContent>
                        <TabsContent value="patient">
                            <p><strong className="font-sans font-medium text-muted-foreground">Email:</strong> {mockPatient.email}</p>
                            <p><strong className="font-sans font-medium text-muted-foreground">Password:</strong> {mockPatient.password}</p>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
