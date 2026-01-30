import { VitalWatchLogo } from "@/components/icons";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Smartphone, Cloud, Database, BrainCircuit, Bell, LayoutDashboard, Wifi, Gauge, TestTube, Thermometer, Filter } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works - VitalWatch',
  description: 'Learn about the streamlined process of our intelligent health monitoring platform, from data collection to AI-powered alerts.',
};


export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Data Acquisition (ESP32 + MAX30100)",
      description: "A wrist-mounted device with a MAX30100 sensor continuously captures photoplethysmography (PPG) signals at ~100Hz. This raw data measures changes in blood volume, from which we can directly derive Heart Rate (HR) and Blood Oxygen (SpO₂).",
      icon: <Smartphone />
    },
    {
        step: 2,
        title: "Initial Calibration & Signal Quality",
        description: "Upon first use, a 60-second baseline calibration is performed to account for wrist placement, skin tone, and ambient light. A Signal Quality Index (SQI) is computed in real-time to discard motion artifacts and ensure data validity.",
        icon: <Gauge />
    },
    {
      step: 3,
      title: "On-Demand Measurement Trigger",
      description: "When the user presses 'Scan Vitals' in the web app, a command is securely sent via a Vercel API route to the designated ESP32. The device then begins a focused 45-second measurement window, applying filtering and averaging.",
      icon: <Wifi />
    },
    {
      step: 4,
      title: "On-Device Estimation (ESP32)",
      description: "The ESP32 processes the filtered PPG signal to extract key features. It uses established formulas based on Pulse Transit Time (PTT) and waveform analysis to generate initial estimations for Systolic and Diastolic Blood Pressure. This is an estimation, not a direct measurement.",
      icon: <Filter />
    },
    {
      step: 5,
      title: "Cloud-Based AI Analysis (Vercel + Gemini)",
      description: "The processed vitals and on-device estimations are sent to a Vercel API Route. A server-side AI model analyzes this data in conjunction with the patient's historical vitals to identify complex trends, estimate glucose trend risk ('Normal', 'Elevated', 'Risky'), and refine the BP category.",
      icon: <BrainCircuit />
    },
    {
      step: 6,
      title: "Secure Data Storage (GridDB Cloud)",
      description: "All data—raw signals, processed values, and AI-generated estimations—is stored in a high-performance GridDB Cloud instance with a server timestamp, linked to the specific user and device ID. The database is optimized for time-series queries.",
      icon: <Database />
    },
     {
      step: 7,
      title: "Intelligent Alerts & Dashboard",
      description: "If any value crosses a critical threshold, an alert is instantly generated, stored in GridDB, and a notification is sent via Telegram. The patient and doctor dashboards update in real-time to display the latest vitals, AI insights, and any new alerts.",
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
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                  Our system translates raw sensor data into actionable health estimations using a multi-stage, medically-informed pipeline. This is an estimation-based system and is not a substitute for clinical diagnostic devices.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
             <div className="relative flex flex-col items-center gap-8">
                {steps.map((step, index) => (
                  <div key={step.step} className="flex flex-col items-center text-center w-full max-w-3xl">
                     <Card className="w-full transition-all hover:shadow-lg">
                       <CardHeader>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                           <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                              {step.icon}
                            </span>
                           </div>
                           <div className="text-center sm:text-left">
                            <CardTitle className="text-2xl">{step.title}</CardTitle>
                            <CardDescription className="mt-1">{step.description}</CardDescription>
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
