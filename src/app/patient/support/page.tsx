import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - Patient Portal | VitalWatch',
  description: 'Get help with the VitalWatch portal or your monitoring device.',
};

export default function PatientSupportPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Support</h1>
      </div>
      <div className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm p-4">
        <div className="w-full max-w-2xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need help with the portal or your device? Let us know.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Issue with device sync" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Details</Label>
                    <Textarea id="message" placeholder="Please describe your issue..." rows={6}/>
                  </div>
                  <Button type="submit" className="w-full">Send Support Request</Button>
                </form>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-semibold">Where can I see my past vital signs?</h4>
                    <p className="text-sm text-muted-foreground">You can view all your historical health data on the 'My Health Data' page.</p>
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold">How do I request a new appointment?</h4>
                    <p className="text-sm text-muted-foreground">Navigate to the 'Appointments' page and click the 'Request New Appointment' button.</p>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
