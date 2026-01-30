import { NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';
import { HealthVital } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { deviceId: string } }
) {
  try {
    const deviceId = params.deviceId;
    const vitalsResults = await getRows('health_vitals', `device_id='${deviceId}'`);
    
    if (!vitalsResults.results || vitalsResults.results.length === 0) {
      return NextResponse.json([]); // Return empty array if no vitals
    }
    
    const columns = vitalsResults.columns;
    const allVitals: HealthVital[] = vitalsResults.results.map((row: any[]) => {
      return columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = row[index];
        return obj;
      }, {} as HealthVital)
    });

    // Sort by timestamp ascending for chart display
    allVitals.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json(allVitals);

  } catch (error: any) {
    console.error(`[/api/vitals/history/${params.deviceId}] Error:`, error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
