import { NextResponse } from 'next/server';
import type { ESP32Data, PatientProfile, HealthVital, AlertHistory } from '@/lib/types';
import { estimateHealthMetrics } from '@/ai/flows/suggest-initial-diagnoses';
import { sendHealthReport, sendCriticalAlert } from '@/lib/telegram';
import { putRows, getRows } from '@/lib/griddb-client';
import { randomUUID } from 'crypto';

type IngestRequestBody = {
  vitals: ESP32Data[];
  chatId?: string; // Optional chatId for Telegram reporting
}

// Helper to add realistic variance to predictions
const addVariance = (value: number, percent: number) => {
    const variance = value * (percent / 100);
    return value + (Math.random() * variance * 2 - variance);
};

export async function POST(request: Request) {
  try {
    const { vitals: incomingVitals, chatId }: IngestRequestBody = await request.json();

    if (!Array.isArray(incomingVitals) || incomingVitals.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty vitals data' }, { status: 400 });
    }

    let finalHealthVital: HealthVital | null = null;

    // Process each reading (usually just one from the bot/scan)
    for (const vital of incomingVitals) {
      // 1. Fetch patient profile to get thresholds
       const patientProfileResults = await getRows('patient_profiles', `patient_id='${vital.deviceId}'`);
      
      if (!patientProfileResults.results || patientProfileResults.results.length === 0) {
        console.warn(`No patient profile found for deviceId: ${vital.deviceId}. Skipping.`);
        continue;
      }

      const profileColumns = patientProfileResults.columns;
      const profileValues = patientProfileResults.results[0];
      const patientProfile: PatientProfile = profileColumns.reduce((obj: any, col: any, index: number) => {
          obj[col.name] = profileValues[index];
          return obj;
      }, {});

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

      const predictions = await estimateHealthMetrics(predictionInput);

      // 3. Check for alerts
      let alert_flag = false;
      let alert_message = '';
      let alert_severity: 'Critical' | 'High' = 'High';

      if (vital.heart_rate > (patientProfile.alert_threshold_hr_high || 120)) {
        alert_flag = true;
        alert_message = `Critical heart rate detected: ${vital.heart_rate.toFixed(0)} BPM.`;
        alert_severity = 'Critical';
      }
      if (vital.spo2 < (patientProfile.alert_threshold_spo2_low || 90)) {
        alert_flag = true;
        alert_message = `Critically Low SpO2 detected: ${vital.spo2.toFixed(1)}%.`;
        alert_severity = 'Critical';
      }
       if ((predictions.estimatedBpCategory === 'High') && (patientProfile.alert_threshold_bp_systolic_high && predictions.confidenceScore > 0.6)) {
         alert_flag = true;
         alert_message = `High BP category predicted.`;
         alert_severity = 'Critical';
      }
       if ((predictions.glucoseTrend === 'Risky') && (patientProfile.alert_threshold_glucose_high && predictions.confidenceScore > 0.6)) {
         alert_flag = true;
         alert_message = `Risky glucose trend predicted.`;
         alert_severity = 'Critical';
      }

      // 4. Send Telegram alert if needed and if a chatId is available
      if (alert_flag && chatId) {
        // This sends a separate, priority alert message
        await sendCriticalAlert(chatId, alert_severity, alert_message);
      }
      
      const now = new Date().toISOString();
      
      // 5. Create more realistic predicted values
      const baseSystolic = predictions.estimatedBpCategory === 'High' ? 145 : 120;
      const baseDiastolic = predictions.estimatedBpCategory === 'High' ? 95 : 80;
      const baseGlucose = predictions.glucoseTrend === 'Risky' ? 210 : 110;

      // 5. Construct the full health vital record
      const healthVitalRecord: HealthVital = {
        timestamp: vital.ts,
        device_id: vital.deviceId,
        heart_rate: vital.heart_rate,
        spo2: vital.spo2,
        ppg_raw: vital.ppg_raw,
        predicted_bp_systolic: addVariance(baseSystolic, 5), // +/- 5% variance
        predicted_bp_diastolic: addVariance(baseDiastolic, 5),
        predicted_glucose: addVariance(baseGlucose, 10), // +/- 10% variance
        alert_flag: alert_flag,
        created_at: now
      };

      // 6. Save to GridDB
      await putRows('health_vitals', [Object.values(healthVitalRecord)]);
      
      finalHealthVital = healthVitalRecord; // Keep the last processed vital for reporting

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

    // 7. If the request came from Telegram, send the full report back
    if (chatId && finalHealthVital) {
      await sendHealthReport(chatId, finalHealthVital);
    }

    return NextResponse.json({ message: 'Vitals ingested successfully.' });

  } catch (error: any) {
    console.error('[/api/vitals/ingest] Error:', error);
    const body = await request.clone().json().catch(() => ({}));
    const chatId = body.chatId;
    if (chatId) {
        await sendCriticalAlert(chatId, 'Critical', 'Failed to process vitals. Please check the system logs.');
    }
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
