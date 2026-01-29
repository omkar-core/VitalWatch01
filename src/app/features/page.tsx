import { VitalWatchLogo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HeartPulse, ShieldCheck, Users, Bot, LayoutGrid, BarChart, Bell } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - VitalWatch',
  description: 'Explore the powerful features of VitalWatch for doctors, patients, and clinics.',
};


export default function FeaturesPage() {
    const doctorFeatures = [
      {
        icon: <LayoutGrid className="w-10 h-10 text-primary" />,
        title: "Multi-Patient Monitoring",
        description: "Oversee all your patients from a single, intuitive dashboard with real-time data updates.",
      },
      {
        icon: <Bell className="w-10 h-10 text-primary" />,
        title: "Real-Time Alerts",
        description: "Receive instant SMS and in-app notifications for critical changes in patient vitals.",
      },
      {
        icon: <BarChart className="w-10 h-10 text-primary" />,
        title: "Trend Visualization",
        description: "Analyze long-term health data with interactive charts to identify patterns and track progress.",
      },
    ];

    const patientFeatures = [
      {
        icon: <HeartPulse className="w-10 h-10 text-primary" />,
        title: "Continuous Tracking",
        description: "Your health data is automatically and continuously monitored without manual effort.",
      },
      {
        icon: <Bot className="w-10 h-10 text-primary" />,
        title: "Personalized Insights",
        description: "Receive AI-powered advice and summaries to better understand your health status.",
      },
      {
        icon: <CheckCircle className="w-10 h-10 text-primary" />,
        title: "Alert Notifications",
        description: "Get notified about important health events and advice from your care team.",
      },
    ];
    
    const clinicFeatures = [
       {
        icon: <ShieldCheck className="w-10 h-10 text-primary" />,
        title: "Device Management",
        description: "Easily enroll, assign, and monitor the status of all connected health devices.",
      },
       {
        icon: <Users className="w-10 h-10 text-primary" />,
        title: "Patient Enrollment",
        description: "A streamlined process for onboarding new patients onto the monitoring platform.",
      },
      {
        icon: <LayoutGrid className="w-10 h-10 text-primary" />,
        title: "Reporting Tools",
        description: "Generate population-level reports to track outcomes and clinic performance.",
      },
    ]


  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b sticky top-0 z-50">
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
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">Smarter, Faster, More Connected Care</h1>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl">
                    Our platform is designed from the ground up for doctors, patients, and clinics to enhance clinical workflows, empower patients, and simplify healthcare administration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="doctor-features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">For Doctors</h2>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {doctorFeatures.map((feature) => (
                <Card key={feature.title} className="bg-background/50 hover:bg-background transition-colors duration-300 h-full">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="patient-features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">For Patients</h2>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {patientFeatures.map((feature) => (
                <Card key={feature.title} className="bg-card/50 hover:bg-card transition-colors duration-300 h-full">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="clinic-features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">For Clinics & Admins</h2>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {clinicFeatures.map((feature) => (
                <Card key={feature.title} className="bg-background/50 hover:bg-background transition-colors duration-300 h-full">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
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
