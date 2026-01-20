import { VitalWatchLogo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Register & Connect Devices",
      description: "Patients and admins can easily set up profiles and connect approved monitoring devices to the platform."
    },
    {
      step: 2,
      title: "Real-Time Data Sync",
      description: "Connected devices securely transmit vital health data to the VitalWatch platform in real-time."
    },
    {
      step: 3,
      title: "Monitor & Analyze",
      description: "Doctors monitor patient data through a centralized dashboard. The system flags any anomalies or critical changes."
    },
    {
      step: 4,
      title: "AI-Powered Insights & Alerts",
      description: "Our AI assistant generates summaries and potential diagnoses. Configurable alerts notify doctors of urgent issues."
    },
     {
      step: 5,
      title: "Engage & Intervene",
      description: "Doctors can communicate with patients, adjust care plans, and intervene proactively based on the data and insights provided."
    },
  ];

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
                  <div key={step.step} className="flex flex-col items-center text-center">
                     <Card className="w-full max-w-md">
                       <CardHeader>
                         <CardTitle className="flex items-center justify-center gap-4">
                           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">{step.step}</span>
                           <span className="font-headline text-2xl">{step.title}</span>
                         </CardTitle>
                       </CardHeader>
                       <CardContent>
                         <p className="text-muted-foreground">{step.description}</p>
                       </CardContent>
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
