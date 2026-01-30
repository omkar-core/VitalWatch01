'use client';
import * as React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VitalWatchLogo } from "@/components/icons";
import { Settings, LayoutDashboard, Users, Bell, BarChart, LifeBuoy, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const [alerts, alertsLoading, alertsError] = useCollection(
    firestore ? query(
      collection(firestore, "alert_history"),
      where("acknowledged", "==", false)
      // In a real app, you'd likely also filter by doctorId
    ) : null
  );

  const unreadAlerts = alerts ? alerts.docs.length : 0;


  React.useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);
  
  if (loading || !user || userProfile?.role !== 'doctor') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/doctor" className="flex items-center gap-2" prefetch={false}>
            <VitalWatchLogo className="w-7 h-7" />
            <span className="font-headline text-lg font-semibold">VitalWatch</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/doctor">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Patient Management">
                <Link href="/doctor/patients">
                  <Users />
                  <span>Patient Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Alerts & Notifications">
                <Link href="/doctor/alerts">
                  <Bell />
                  <span>Alerts & Notifications</span>
                  {unreadAlerts > 0 && <Badge variant="destructive" className="ml-auto">{unreadAlerts}</Badge>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Analytics & Reports">
                <Link href="/doctor/analytics">
                  <BarChart />
                  <span>Analytics & Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <DashboardHeader title="Clinical Dashboard" userProfile={userProfile} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
