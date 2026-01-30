import { NextRequest, NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';
import { HealthVital } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    // TQL for getting the latest record is a bit more complex, often involving order by and limit.
    // Assuming a simplified query for demonstration.
    // A real implementation might be: `select * from health_vitals where device_id='${deviceId}' order by timestamp desc limit 1`
    const vitalsResults = await getRows('health_vitals', `device_id='${deviceId}'`);
    
    if (!vitalsResults.results || vitalsResults.results.length === 0) {
      return NextResponse.json(null); // Return null if no vitals found
    }

    // Find the latest one manually if TQL is limited
    const latestReading = vitalsResults.results.reduce((latest: any, current: any) => {
        // Assuming timestamp is the first column at index 0
        return new Date(current[0]) > new Date(latest[0]) ? current : latest;
    });
    
    const columns = vitalsResults.columns;
    const vital: HealthVital = columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = latestReading[index];
        return obj;
    }, {});


    return NextResponse.json(vital);

  } catch (error: any) {
    console.error(`[/api/vitals/latest/[deviceId]] Error:`, error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
