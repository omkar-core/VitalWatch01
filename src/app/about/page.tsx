import { VitalWatchLogo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - VitalWatch',
  description: 'Our mission is to revolutionize remote patient monitoring with intelligent, real-time health data.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <VitalWatchLogo className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-foreground">VitalWatch</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>About</Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>How It Works</Link>
          <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Features</Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Pricing</Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Contact</Link>
          <Link href="/login" prefetch={false}>
            <Button>Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">About VitalWatch</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our mission is to revolutionize remote patient monitoring with intelligent, real-time health data.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Story</div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl">Connecting Patients and Doctors Like Never Before</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Founded by a team of healthcare professionals and technology experts, VitalWatch was born from a shared vision to bridge the gap between patient care and modern technology. We believe in proactive, not reactive, healthcare.
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform leverages the power of AI and real-time data to provide clinicians with the insights they need to make timely decisions, while empowering patients to take an active role in their health journey.
              </p>
            </div>
            <div className="flex justify-center">
                <VitalWatchLogo className="w-48 h-48 text-primary" />
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Technology Philosophy</h2>
            <div className="mx-auto max-w-3xl text-center space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Why GridDB Cloud?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            For a system that processes millions of data points per second, we needed a database that was not only fast but also incredibly reliable and scalable. GridDB Cloud's time-series capabilities allow us to query vast amounts of vital sign data with millisecond latency, which is crucial for real-time analysis and alerting. Its hybrid in-memory architecture ensures that the most recent, most critical data is always available for immediate processing by our ML models.
                        </p>
                    </CardContent>
                </Card>
                <p className="text-muted-foreground">We combine GridDB's power with Azure IoT Hub for secure device communication and a robust ML pipeline for predictive analytics, creating a healthcare platform that's truly ahead of the curve.</p>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 VitalWatch. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
