import { NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';

export async function GET(request: Request) {
  try {
    // Get the start of the current day in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // WARNING: This query might be inefficient on large datasets as it fetches all rows.
    // A real production environment would use a `COUNT` aggregation if supported by the client,
    // or a dedicated analytics service. For this demo, we fetch and count.
    const query = `created_at >= TIMESTAMP('${todayISO}')`;
    const vitalsResults = await getRows('health_vitals', query);
    
    const count = vitalsResults.results?.length || 0;

    return NextResponse.json({ count });

  } catch (error: any) {
    console.error('[/api/vitals/today] Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
