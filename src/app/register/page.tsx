"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalWatchLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
            <VitalWatchLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-foreground">VitalWatch</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Registration</CardTitle>
            <CardDescription>
              Registration is currently disabled for demonstration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can browse the application dashboards directly without an account in this demo version.
            </p>
            <div className="flex flex-col gap-2">
                <Button asChild>
                    <Link href="/doctor">Doctor Dashboard</Link>
                </Button>
                <Button asChild>
                    <Link href="/patient">Patient Dashboard</Link>
                </Button>
                 <Button asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
         <p className="px-8 text-center text-sm text-muted-foreground mt-4">
            Have an account?{" "}
            <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
            >
                Login
            </Link>
        </p>
      </div>
    </div>
  );
}
