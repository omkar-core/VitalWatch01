import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalWatchLogo } from "@/components/icons";
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'Register - VitalWatch',
  description: 'Create a new VitalWatch account.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
            <VitalWatchLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-foreground">VitalWatch</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Registration Disabled</CardTitle>
            <CardDescription>User registration and authentication are currently bypassed for demonstration purposes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <p className="text-sm text-muted-foreground">
                You can access the different dashboards directly from the login page.
            </p>
            <Button asChild>
                <Link href="/login">Go to Login Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
