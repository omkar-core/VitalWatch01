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
import { Settings, LayoutDashboard, Users, Bell, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/lib/data";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

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
              <SidebarMenuButton asChild tooltip="Patients">
                <Link href="#">
                  <Users />
                  <span>Patients</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Alerts">
                <Link href="#">
                  <Bell />
                  <span>Alerts</span>
                  {unreadAlerts > 0 && <Badge variant="destructive" className="ml-auto">{unreadAlerts}</Badge>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages">
                <Link href="#">
                  <MessageSquare />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <DashboardHeader userRole="doctor" title="Clinical Dashboard" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
