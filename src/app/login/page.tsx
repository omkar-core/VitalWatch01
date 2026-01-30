import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalWatchLogo } from "@/components/icons";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { User, Shield, UserCog } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - VitalWatch",
  description: "Access your VitalWatch account.",
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
            <CardTitle className="text-2xl">Dashboard Access (Mock)</CardTitle>
            <CardDescription>Select a role to view the corresponding dashboard. Authentication is bypassed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/patient" passHref>
              <Button className="w-full gap-2" size="lg">
                <User /> Patient Dashboard
              </Button>
            </Link>
            <Link href="/doctor" passHref>
              <Button className="w-full gap-2" size="lg" variant="outline">
                <Shield /> Doctor Dashboard
              </Button>
            </Link>
             <Link href="/admin" passHref>
              <Button className="w-full gap-2" size="lg" variant="secondary">
                <UserCog /> Admin Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
