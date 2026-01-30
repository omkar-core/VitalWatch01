import { NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';
import type { AlertHistory } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  
  try {
    let query = '1=1'; // Fetch all if no patientId
    if (patientId) {
      query = `patient_id='${patientId}'`;
    }
    
    const alertsResults = await getRows('alert_history', query);
    
    if (!alertsResults.results || alertsResults.results.length === 0) {
      return NextResponse.json([]);
    }

    const columns = alertsResults.columns;
    const alerts: AlertHistory[] = alertsResults.results.map((row: any[]) => {
       return columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = row[index];
        return obj;
      }, {}) as AlertHistory;
    });

    // Sort by timestamp descending
    alerts.sort((a: AlertHistory, b: AlertHistory) => new Date(b.alert_timestamp).getTime() - new Date(a.alert_timestamp).getTime());

    return NextResponse.json(alerts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An internal server error occurred.';
    console.error('[/api/alerts] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
