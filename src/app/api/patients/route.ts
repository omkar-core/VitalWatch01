import { NextResponse } from 'next/server';
import { getRows } from '@/lib/griddb-client';
import { PatientProfile } from '@/lib/types';

export async function GET() {
  try {
    const patientProfilesResults = await getRows('patient_profiles', '1=1'); // Get all
    
    if (!patientProfilesResults.results || patientProfilesResults.results.length === 0) {
      return NextResponse.json([]);
    }

    const columns = patientProfilesResults.columns;
    const profiles = patientProfilesResults.results.map((row: any[]) => {
       return columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = row[index];
        return obj;
      }, {});
    });

    return NextResponse.json(profiles);
  } catch (error: any) {
    console.error('[/api/patients] Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const profile: Omit<PatientProfile, 'created_at' | 'updated_at'> = await request.json();

        const now = new Date().toISOString();
        const newProfile: PatientProfile = {
            ...profile,
            created_at: now,
            updated_at: now,
        };

        // GridDB expects an array of arrays for rows
        await putRows('patient_profiles', [Object.values(newProfile)]);

        return NextResponse.json({ message: "Patient registered successfully", patientId: newProfile.patient_id }, { status: 201 });

    } catch (error: any) {
        console.error('[/api/patients] POST Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
