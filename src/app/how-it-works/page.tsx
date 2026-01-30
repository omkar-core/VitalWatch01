import { VitalWatchLogo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Smartphone, Cloud, Database, BrainCircuit, Bell, LayoutDashboard, Wifi } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works - VitalWatch',
  description: 'Learn about the streamlined process of our intelligent health monitoring platform, from data collection to AI-powered alerts.',
};


export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Wearable Sensor Data Collection",
      description: "A wrist-mounted device with a MAX30100 sensor continuously captures photoplethysmography (PPG) signals, which measure changes in blood volume. From this, we directly derive Heart Rate (HR) and Blood Oxygen (SpO₂).",
      icon: <Smartphone />
    },
    {
      step: 2,
      title: "Secure Data Transmission",
      description: "A dedicated gateway (or the user's phone) collects data from the sensor and securely transmits it to the cloud using the MQTT protocol, with offline buffering to prevent data loss.",
      icon: <Wifi />
    },
    {
      step: 3,
      title: "AI-Powered Estimation",
      description: "Our cloud-based AI model analyzes the time-series data (HR, SpO₂, pulse waveform) along with user profile information to estimate trends in blood pressure and glucose. This is an estimation, not a direct measurement.",
      icon: <BrainCircuit />
    },
    {
      step: 4,
      title: "High-Performance Storage in Firestore",
      description: "Raw sensor readings and AI-generated estimations are stored in a scalable time-series structure within Firestore, optimized for rapid querying and analysis.",
      icon: <Database />
    },
     {
      step: 5,
      title: "Intelligent Alerts & Notifications",
      description: "If direct readings (like SpO₂) or AI-estimated trends (like BP or glucose) cross critical thresholds, instant alerts are sent to both doctors and patients, enabling timely intervention.",
      icon: <Bell />
    },
    {
      step: 6,
      title: "Dashboard Visualization",
      description: "Care teams and patients access real-time sensor data, AI-powered estimations, and historical trends through their respective secure web portals.",
      icon: <LayoutDashboard />
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="px-4 lg:px-6 h-16 flex items-center bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <VitalWatchLogo className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-foreground">VitalWatch</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>About</Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>How It Works</Link>
          <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Features</Link>
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
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">From Signal to Insight</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our system translates raw sensor data into actionable health estimations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
             <div className="relative flex flex-col items-center gap-8">
                {steps.map((step, index) => (
                  <div key={step.step} className="flex flex-col items-center text-center w-full max-w-2xl">
                     <Card className="w-full transition-all hover:shadow-lg">
                       <CardHeader>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                           <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                              {step.icon}
                            </span>
                            <span className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">{step.step}</span>
                           </div>
                           <div className="text-center sm:text-left">
                            <CardTitle className="text-2xl">{step.title}</CardTitle>
                            <p className="text-muted-foreground mt-1">{step.description}</p>
                           </div>
                         </div>
                       </CardHeader>
                     </Card>
                     {index < steps.length - 1 && <ArrowDown className="w-8 h-8 text-muted-foreground my-4" />}
                  </div>
                ))}
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
