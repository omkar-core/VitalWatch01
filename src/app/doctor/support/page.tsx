import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - Doctor Portal | VitalWatch',
  description: 'Get help and support for the VitalWatch platform.',
};

export default function DoctorSupportPage() {
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
                  Have an issue or a question? Fill out the form below and our team will get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Issue with patient dashboard" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Details</Label>
                    <Textarea id="message" placeholder="Please describe the issue in detail..." rows={6}/>
                  </div>
                  <Button type="submit" className="w-full">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-semibold">How do I add a new patient?</h4>
                    <p className="text-sm text-muted-foreground">You can add a new patient from the Patient Management page by clicking the 'Add Patient' button.</p>
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold">How can I configure my alert notifications?</h4>
                    <p className="text-sm text-muted-foreground">You can customize your notification preferences in the Settings page under 'Notification Settings'.</p>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
