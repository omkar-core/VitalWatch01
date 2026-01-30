import { NextResponse } from 'next/server';
import { getRows, putRows } from '@/lib/griddb-client';
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
        const profile: PatientProfile = await request.json();

        // GridDB expects an array of arrays for rows. Order is critical.
        const profileRow = [
            profile.patient_id,
            profile.device_id,
            profile.name,
            profile.age,
            profile.gender,
            profile.email,
            profile.phone,
            profile.avatar_url,
            profile.baseline_hr,
            profile.baseline_spo2,
            profile.baseline_bp_systolic,
            profile.baseline_bp_diastolic,
            profile.has_diabetes,
            profile.has_hypertension,
            profile.has_heart_condition,
            profile.alert_threshold_hr_high,
            profile.alert_threshold_hr_low,
            profile.alert_threshold_spo2_low,
            profile.alert_threshold_bp_systolic_high,
            profile.alert_threshold_glucose_high,
            profile.emergency_contact_name,
            profile.emergency_contact_phone,
            profile.created_at,
            profile.updated_at,
            profile.is_active
        ];

        await putRows('patient_profiles', [profileRow]);

        return NextResponse.json({ message: "Patient registered successfully", patientId: profile.patient_id }, { status: 201 });

    } catch (error: any) {
        console.error('[/api/patients] POST Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
