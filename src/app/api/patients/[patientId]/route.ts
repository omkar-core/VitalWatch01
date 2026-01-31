import { NextRequest, NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';

export async function GET(
  request: NextRequest
) {
  try {
    const patientId = request.nextUrl.pathname.split('/')[3];

    if (!patientId) {
        return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }
    
    const patientProfileResults = await getRows('patient_profiles', `patient_id='${patientId}'`);
    
    if (!patientProfileResults.results || patientProfileResults.results.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Assuming GridDB client returns column names and then rows of values
    const columns = patientProfileResults.columns;
    const values = patientProfileResults.results[0];
    const patientProfile = columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = values[index];
        return obj;
    }, {});


    return NextResponse.json(patientProfile);
  } catch (error: any) {
    console.error(`[/api/patients/[patientId]] Error:`, error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
