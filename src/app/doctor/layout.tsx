'use client';
import * as React from 'react';
import Link from "next/link";
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
import { Settings, LayoutDashboard, Users, Bell, BarChart, LifeBuoy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockDoctor, mockAlerts } from '@/lib/mock-data';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = mockDoctor;
  const unreadAlerts = mockAlerts?.filter(a => !a.isRead).length || 0;

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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/doctor/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Support">
                <Link href="/doctor/support">
                  <LifeBuoy />
                  <span>Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <DashboardHeader title="Clinical Dashboard" userProfile={userProfile} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
