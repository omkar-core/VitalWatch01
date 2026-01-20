import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { CheckCircle, HeartPulse, ShieldCheck, Users, Bot, Cloud, BarChart } from "lucide-react";
import { VitalWatchLogo } from "@/components/icons";

export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === "hero-background");

  const features = [
    {
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
      title: "Continuous Monitoring",
      description: "Real-time glucose & BP tracking for rural patients.",
    },
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "Predictive Alerts",
      description: "ML algorithms predict critical events before they happen.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Doctor Dashboard",
      description: "A centralized view of all patient data and alerts.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "GridDB Time-Series Storage",
      description: "Built on a high-performance, scalable time-series database.",
    },
  ];

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
          <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Pricing</Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>Contact</Link>
          <Link href="/login" prefetch={false}>
            <Button>Login</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-24 lg:py-32 xl:py-40 relative">
          <div className="absolute inset-0 -z-10">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover opacity-10"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Continuous NCD Monitoring That Saves Lives
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Real-time glucose & BP tracking for 1 lakh+ rural patients, powered by GridDB Cloud and advanced AI.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/register" prefetch={false}>
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/how-it-works" prefetch={false}>
                  <Button size="lg" variant="secondary">Watch Demo</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">The Current Crisis</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                  <Card className="text-center">
                      <CardHeader><CardTitle className="text-4xl font-bold">90M</CardTitle></CardHeader>
                      <CardContent><p className="text-muted-foreground">diabetics in India, a number rapidly growing.</p></CardContent>
                  </Card>
                   <Card className="text-center">
                      <CardHeader><CardTitle className="text-4xl font-bold">157M</CardTitle></CardHeader>
                      <CardContent><p className="text-muted-foreground">projected diabetics by 2050 if trends continue.</p></CardContent>
                  </Card>
                   <Card className="text-center">
                      <CardHeader><CardTitle className="text-4xl font-bold">30%</CardTitle></CardHeader>
                      <CardContent><p className="text-muted-foreground">of adults in rural India are hypertensive.</p></CardContent>
                  </Card>
              </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Our Solution</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide a robust, scalable, and affordable remote monitoring solution designed for the unique challenges of rural healthcare.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background/50 hover:bg-background transition-colors duration-300 h-full">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

         <section id="social-proof" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Pilot Program Success</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our initial deployment has already shown significant impact in rural Karnataka.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="text-center space-y-2">
                    <p className="text-5xl font-bold font-headline">500+</p>
                    <p className="text-muted-foreground">Patients Monitored</p>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-5xl font-bold font-headline">3</p>
                    <p className="text-muted-foreground">PHCs in Karnataka</p>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-5xl font-bold font-headline">40%</p>
                    <p className="text-muted-foreground">Reduction in ER Visits</p>
                </div>
            </div>
            <blockquote className="mt-6 border-l-2 pl-6 italic text-center max-w-3xl mx-auto">
              "VitalWatch has been a game-changer for our district. We can now proactively manage chronic diseases in a way that was never possible before."
              <footer className="mt-2">- District Health Officer, Karnataka</footer>
            </blockquote>
          </div>
        </section>

        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-card">
           <div className="container px-4 md:px-6 text-center">
             <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Ready to Transform Patient Care?</h2>
             <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">
                Join us in bringing world-class healthcare to every corner of India.
              </p>
             <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Button size="lg" asChild><Link href="/register?role=doctor">For Doctors: Request Demo</Link></Button>
                <Button size="lg" variant="secondary" asChild><Link href="/register?role=admin">For Clinics: Partner With Us</Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/about">For Patients: Learn More</Link></Button>
             </div>
           </div>
        </section>

      </main>

      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div>
          <p className="text-xs text-muted-foreground">&copy; 2024 VitalWatch. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Proud winner of the GridDB Hackathon.</p>
        </div>
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
