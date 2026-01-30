'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import type { Metadata } from 'next';
import { useUser } from "@/firebase/auth/use-user";
import { useFirestore } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, where, orderBy } from "firebase/firestore";
import type { Alert } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function PatientAlertsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const alertsQuery = user ? query(collection(firestore, 'alerts'), where('patientId', '==', user.uid), orderBy('timestamp', 'desc')) : null;
  const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
  
  const loading = userLoading || alertsLoading;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Alerts & Advice</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-lg border border-dashed shadow-sm p-4">
        {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
             </div>
        ) : alerts && alerts.length > 0 ? (
            alerts.map((item) => (
                <Card key={item.id}>
                    <CardHeader className="flex flex-row items-start gap-4">
                        {item.severity === 'Critical' || item.severity === 'High' ? <AlertTriangle className="h-6 w-6 text-yellow-500" /> : <Info className="h-6 w-6 text-primary" />}
                        <div>
                            <CardTitle>{item.severity} Alert</CardTitle>
                            <CardDescription>{item.timestamp?.toDate() ? formatDistanceToNow(item.timestamp.toDate()) : ''} ago</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{item.message}</p>
                    </CardContent>
                </Card>
            ))
        ) : (
             <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    No Alerts or Advice
                </h3>
                <p className="text-sm text-muted-foreground">
                    You have no new health alerts or advice from your care team.
                </p>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
