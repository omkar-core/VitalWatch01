import { VitalWatchLogo } from "@/components/icons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from 'next';
import { LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: 'Login - VitalWatch',
  description: 'Access your VitalWatch account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
           <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
            <VitalWatchLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-headline font-bold text-foreground">VitalWatch</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Authentication is bypassed in mock mode. Select a role to continue.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
                <Link href="/doctor" className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login as Doctor
                </Link>
            </Button>
             <Button asChild>
                <Link href="/patient" className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login as Patient
                </Link>
            </Button>
             <Button asChild>
                <Link href="/admin" className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login as Admin
                </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline">
                    Register
                </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
