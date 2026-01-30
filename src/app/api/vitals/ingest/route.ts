import { NextResponse } from 'next/server';
import type { ESP32Data, PatientProfile, HealthVital, AlertHistory } from '@/lib/types';
import { estimateHealthMetrics } from '@/ai/flows/suggest-initial-diagnoses';
import { sendTelegramAlert } from '@/lib/telegram';
import { putRows, getRows } from '@/lib/griddb-client'; // Using the new GridDB client
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const incomingVitals: ESP32Data[] = await request.json();

    if (!Array.isArray(incomingVitals) || incomingVitals.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty vitals data' }, { status: 400 });
    }

    // Process each reading
    for (const vital of incomingVitals) {
      // 1. Fetch patient profile to get thresholds
      const patientProfileResults = await getRows('patient_profiles', `patient_id='${vital.deviceId}'`);
      if (!patientProfileResults.results || patientProfileResults.results.length === 0) {
        console.warn(`No patient profile found for deviceId: ${vital.deviceId}. Skipping.`);
        continue;
      }
      const patientProfile: PatientProfile = patientProfileResults.results[0];

      // 2. Call ML model for predictions
      const predictionInput = {
          age: patientProfile.age || 50,
          gender: patientProfile.gender || 'Other',
          medicalHistory: `Diabetes: ${patientProfile.has_diabetes}, Hypertension: ${patientProfile.has_hypertension}`,
          currentVitals: {
              timestamp: vital.ts,
              Glucose: 0, // Placeholder, as we are predicting it
              Systolic: 0, // Placeholder
              Diastolic: 0, // Placeholder
              'Heart Rate': vital.heart_rate,
              SPO2: vital.spo2,
          }
      };

      // In a real scenario, you'd have separate models. Here we use one for demo.
      const predictions = await estimateHealthMetrics(predictionInput);

      // 3. Check for alerts
      let alert_flag = false;
      let alert_message = '';
      let alert_severity: 'Critical' | 'High' = 'High';

      if (vital.heart_rate > (patientProfile.alert_threshold_hr_high || 100)) {
        alert_flag = true;
        alert_message = `High heart rate detected: ${vital.heart_rate.toFixed(0)} BPM.`;
      }
      if (vital.spo2 < (patientProfile.alert_threshold_spo2_low || 92)) {
        alert_flag = true;
        alert_message = `Low SpO2 detected: ${vital.spo2.toFixed(1)}%.`;
        alert_severity = 'Critical';
      }
      if ((predictions.estimatedBpCategory === 'High') && vital.heart_rate > (patientProfile.baseline_hr || 80)) {
         alert_flag = true;
         alert_message = `High BP category predicted.`;
         alert_severity = 'Critical';
      }
       if ((predictions.glucoseTrend === 'Risky') && (predictions.confidenceScore > 0.7)) {
         alert_flag = true;
         alert_message = `Risky glucose trend predicted.`;
         alert_severity = 'Critical';
      }

      // 4. Send Telegram alert if needed
      if (alert_flag) {
        await sendTelegramAlert(patientProfile.name || 'Unknown Patient', alert_severity, alert_message);
      }
      
      const now = new Date().toISOString();

      // 5. Save to GridDB
      const healthVitalRecord: HealthVital = {
        timestamp: vital.ts,
        device_id: vital.deviceId,
        heart_rate: vital.heart_rate,
        spo2: vital.spo2,
        ppg_raw: vital.ppg_raw,
        predicted_bp_systolic: predictions.estimatedBpCategory === 'High' ? 145 : 120, // Mock value based on category
        predicted_bp_diastolic: predictions.estimatedBpCategory === 'High' ? 95 : 80, // Mock value based on category
        predicted_glucose: predictions.glucoseTrend === 'Risky' ? 210 : 110, // Mock value based on category
        alert_flag: alert_flag,
        created_at: now
      };

      await putRows('health_vitals', [Object.values(healthVitalRecord)]);


      if (alert_flag) {
        const alertRecord: AlertHistory = {
            alert_timestamp: vital.ts,
            alert_id: randomUUID(),
            device_id: vital.deviceId,
            patient_id: patientProfile.patient_id,
            alert_type: "Vital Threshold Exceeded",
            severity: alert_severity,
            alert_message: alert_message,
            heart_rate: vital.heart_rate,
            spo2: vital.spo2,
            ppg_raw: vital.ppg_raw,
            predicted_glucose: healthVitalRecord.predicted_glucose,
            predicted_bp_systolic: healthVitalRecord.predicted_bp_systolic,
            predicted_bp_diastolic: healthVitalRecord.predicted_bp_diastolic,
            acknowledged: false,
            created_at: now
        };
        await putRows('alert_history', [Object.values(alertRecord)]);
      }
    }

    return NextResponse.json({ message: 'Vitals ingested successfully.' });

  } catch (error: any) {
    console.error('[/api/vitals/ingest] Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
