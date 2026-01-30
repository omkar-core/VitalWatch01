'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VitalWatchLogo } from '@/components/icons';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2"
            prefetch={false}
          >
            <VitalWatchLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold text-foreground">
              VitalWatch
            </span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Join VitalWatch to monitor your health.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
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
