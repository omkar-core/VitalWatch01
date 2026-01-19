import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { CheckCircle, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { VitalWatchLogo } from "@/components/icons";

export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === "hero-background");

  const features = [
    {
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
      title: "Real-Time Monitoring",
      description: "Doctors get instant access to patient vitals, enabling proactive care and timely interventions.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Leverage generative AI for patient summaries and potential diagnostic suggestions to support clinical decisions.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Patient-Centric Portal",
      description: "Empower patients with access to their health data, trends, and secure communication channels.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Secure & Scalable",
      description: "A robust platform for clinics and hospitals with comprehensive admin controls for users and devices.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <VitalWatchLogo className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline font-bold text-foreground">VitalWatch</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" prefetch={false}>
            <Button>Login</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
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
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  A New Era of Health Monitoring
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  VitalWatch provides doctors, patients, and administrators with a unified platform for real-time health data, AI-driven insights, and seamless communication.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login?role=doctor" prefetch={false}>
                  <Button size="lg">Doctor Portal</Button>
                </Link>
                <Link href="/login?role=patient" prefetch={false}>
                  <Button size="lg" variant="secondary">Patient Portal</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Smarter, Faster, More Connected Care</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed from the ground up to enhance clinical workflows, empower patients, and simplify healthcare administration.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background/50 hover:bg-background transition-colors duration-300">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
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
