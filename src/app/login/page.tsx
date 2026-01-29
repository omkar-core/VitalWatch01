import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalWatchLogo } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - VitalWatch",
  description: "Access your VitalWatch account.",
};

export default function LoginPage() {
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
      </div>
    </div>
  );
}
