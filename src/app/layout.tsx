import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { inter, spaceGrotesk } from './fonts';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VitalWatch | Intelligent Health Monitoring',
    template: '%s | VitalWatch',
  },
  description: 'An AI-powered platform that translates real-time vital signs from wearable devices into actionable insights, enabling early detection and timely intervention for chronic conditions.',
  keywords: ['Remote Patient Monitoring', 'Health Tech', 'AI in Healthcare', 'Chronic Disease Management', 'Telehealth', 'GridDB', 'ESP32', 'PPG'],
   openGraph: {
    title: 'VitalWatch | Intelligent Health Monitoring',
    description: 'A new era of remote patient care, powered by AI and real-time data.',
    url: 'https://vitalwatch-demo.vercel.app', // Replace with your actual deployed URL
    siteName: 'VitalWatch',
    images: [
      {
        url: 'https://vitalwatch-demo.vercel.app/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitalWatch | Intelligent Health Monitoring',
    description: 'An AI-powered platform that translates real-time vital signs from wearable devices into actionable insights.',
    // creator: '@yourtwitterhandle', // Replace with your Twitter handle
    images: ['https://vitalwatch-demo.vercel.app/og-image.png'], // Replace with your actual OG image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, spaceGrotesk.variable)}>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
          <FirebaseErrorListener />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
