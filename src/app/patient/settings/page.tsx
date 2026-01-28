"use client";

import * as React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BatteryFull, Smartphone, Trash2, Wifi, Loader2 } from "lucide-react"
import type { Metadata } from 'next';
import { sendCommandToDevice } from "@/lib/device-commands";
import { useFirestore } from "@/firebase/provider";
import { useToast } from "@/hooks/use-toast";

export default function PatientSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSyncing, setIsSyncing] = React.useState(false);

    const handleDeviceSync = async () => {
        setIsSyncing(true);
        try {
            // In a real app, the device ID would come from the user's profile.
            // For this demo, we'll hardcode it based on the mock data.
            const deviceId = 'CGM_LIBRE_45678';
            await sendCommandToDevice(firestore, deviceId, 'start_scan');
            toast({
            title: 'Sync Initiated',
            description: `A request has been sent to sync with device ${deviceId}.`,
            });
        } catch (error: any) {
            toast({
            variant: 'destructive',
            title: 'Sync Failed',
            description: error.message || 'Could not initiate device sync.',
            });
        } finally {
            setIsSyncing(false);
        }
    };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Settings</h1>
      </div>
      <div className="flex flex-1 justify-center rounded-lg p-4">
        <div className="w-full max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>
                Update your personal and emergency contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Ramaiah S." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-contact">Emergency Contact Phone</Label>
                <Input id="emergency-contact" type="tel" defaultValue="+91-9876543211" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="New Password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Device Settings</CardTitle>
                <CardDescription>Manage your connected monitoring devices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Smartphone className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold">CGM_LIBRE_45678</p>
                            <p className="text-sm text-muted-foreground">Status: Connected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <BatteryFull />
                        <span>85%</span>
                    </div>
                </div>
                <Button onClick={handleDeviceSync} disabled={isSyncing} className="w-full">
                    {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2" />}
                    {isSyncing ? 'Syncing...' : 'Sync Device Now'}
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>
                Choose how we contact you for alerts and reminders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="sms-comms" defaultChecked />
                    <label
                        htmlFor="sms-comms"
                        className="text-sm font-medium leading-none"
                    >
                        Health alerts via SMS
                    </label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="whatsapp-comms" />
                    <label
                        htmlFor="whatsapp-comms"
                        className="text-sm font-medium leading-none"
                    >
                        Health alerts via WhatsApp
                    </label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="email-comms" />
                    <label
                        htmlFor="email-comms"
                        className="text-sm font-medium leading-none"
                    >
                        Appointment reminders via email
                    </label>
                </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline">Download My Data</Button>
                <div className="mt-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <h4 className="font-semibold text-destructive">Delete My Account</h4>
                    <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all associated health data. This action cannot be undone.</p>
                    <Button variant="destructive" className="mt-4"><Trash2 className="mr-2"/>Delete Account</Button>
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  )
}
