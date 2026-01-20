import { VitalWatchLogo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - VitalWatch',
  description: 'Affordable and transparent pricing plans for clinics and hospitals of all sizes.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Pilot Program",
      price: "Free",
      period: "for first 500 patients",
      description: "Ideal for new clinics and pilot studies to validate our platform's impact.",
      features: [
        "Up to 500 patients",
        "Continuous Monitoring",
        "Real-time Alerts",
        "Doctor & Patient Portals",
        "Standard Support",
      ],
      cta: "Join the Pilot",
      variant: "secondary",
    },
    {
      name: "Basic Plan",
      price: "₹50",
      period: "/ patient / month",
      description: "Essential features for small to medium-sized clinics.",
      features: [
        "All features from Pilot",
        "Up to 2,000 patients",
        "Basic Analytics",
        "Email & SMS Notifications",
        "Dedicated Onboarding",
      ],
      cta: "Get Started",
      variant: "default",
    },
    {
      name: "Standard Plan",
      price: "₹100",
      period: "/ patient / month",
      description: "Advanced features for growing healthcare organizations.",
      features: [
        "All features from Basic",
        "Up to 10,000 patients",
        "Population Health Analytics",
        "WhatsApp Notifications",
        "Priority Support",
      ],
      cta: "Choose Standard",
      variant: "secondary",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "for large-scale deployments",
      description: "Comprehensive solutions for large hospitals and district-level health programs.",
      features: [
        "All features from Standard",
        "Unlimited Patients",
        "Advanced Population Analytics",
        "API & EMR Integration",
        "24/7 Premium Support",
        "Custom Branding",
      ],
      cta: "Contact Sales",
      variant: "secondary",
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Pricing</div>
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">Transparent Plans for Every Scale</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the plan that fits your organization's needs. No hidden fees. Ever.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-stretch gap-8 px-4 md:px-6 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card key={tier.name} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" variant={tier.variant as "default" | "secondary"}>{tier.cta}</Button>
                </div>
              </Card>
            ))}
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
