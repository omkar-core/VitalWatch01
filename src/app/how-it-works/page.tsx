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
      title: "Patient Wears Sensors",
      description: "Non-invasive, continuous monitoring through a CGM device and BP wristband.",
      icon: <Smartphone />
    },
    {
      step: 2,
      title: "ESP32 Gateway Syncs Data",
      description: "A dedicated gateway collects data via Bluetooth and securely sends it to the cloud over Wi-Fi. Features offline buffering to prevent data loss.",
      icon: <Wifi />
    },
    {
      step: 3,
      title: "Secure Cloud Ingestion via Azure IoT Hub",
      description: "Data is ingested using the secure and scalable MQTT protocol, ensuring every data point is authenticated and encrypted.",
      icon: <Cloud />
    },
    {
      step: 4,
      title: "High-Performance Storage in GridDB",
      description: "Vital signs are stored in a GridDB time-series database, optimized for massive write throughput and rapid query performance.",
      icon: <Database />
    },
     {
      step: 5,
      title: "Real-time ML Analysis",
      description: "Our AI models analyze incoming data for anomaly detection, predict glucose spikes, and classify patient risk levels in real-time.",
      icon: <BrainCircuit />
    },
    {
      step: 6,
      title: "Intelligent Alerts Triggered",
      description: "Doctors and patients receive instant SMS, WhatsApp, and push notifications for critical events, enabling timely intervention.",
      icon: <Bell />
    },
    {
      step: 7,
      title: "Dashboard Access for Care Teams and Patients",
      description: "Care teams and patients access real-time data, trends, and insights through their respective secure web portals.",
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
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">How It Works</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A simple, streamlined process for intelligent health monitoring.
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
