'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VitalWatchLogo } from '@/components/icons';
import { LoginForm } from '@/components/auth/login-form';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user and profile are loaded, redirect them
    if (!loading && user && userProfile) {
      switch (userProfile.role) {
        case 'doctor':
          router.replace('/doctor');
          break;
        case 'patient':
          router.replace('/patient');
          break;
        case 'admin':
          router.replace('/admin');
          break;
        default:
          router.replace('/'); // Fallback
      }
    }
  }, [user, userProfile, loading, router]);

  // If user is logged in but profile is still loading, show a loading indicator
  // or if we are just initially loading the user state.
  if (loading || (user && !userProfile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show the login form
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
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
