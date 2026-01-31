
import { NextRequest, NextResponse } from 'next/server';
import type { ESP32Data, PatientProfile, HealthVital, AlertHistory } from '@/lib/types';
import { estimateHealthMetrics } from '@/ai/flows/suggest-initial-diagnoses';
import { sendHealthReport, sendCriticalAlert } from '@/lib/telegram';
import { putRows, getRows } from '@/lib/griddb-client';
import { validateDeviceRequest } from '@/lib/device-auth';
import { randomUUID } from 'crypto';

type IngestRequestBody = {
  vitals: ESP32Data[];
  chatId?: string; // Optional chatId for Telegram reporting
  internal_secret?: string; // Optional secret for internal calls
}

export async function POST(request: NextRequest) {
  const body: IngestRequestBody = await request.json();
  
  // 1. Authenticate Request
  const isInternalCall = body.internal_secret === process.env.INTERNAL_API_SECRET;
  if (!isInternalCall) {
    const authError = validateDeviceRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }
  }

  try {
    const { vitals: incomingVitals, chatId } = body;

    if (!Array.isArray(incomingVitals) || incomingVitals.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty vitals data' }, { status: 400 });
    }

    let finalHealthVital: HealthVital | null = null;

    // Process each reading (usually just one from the bot/scan)
    for (const vital of incomingVitals) {
      // 2. Fetch patient profile to get context and thresholds
      const patientProfileResults = await getRows('patient_profiles', `device_id='${vital.deviceId}'`);
      
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

      // 3. Call Gemini AI model for predictions
      const predictionInput = {
          age: patientProfile.age || 50,
          gender: patientProfile.gender || 'Other',
          medicalHistory: `Diabetes: ${patientProfile.has_diabetes}, Hypertension: ${patientProfile.has_hypertension}, Heart Condition: ${patientProfile.has_heart_condition}`,
          currentVitals: {
              timestamp: vital.ts,
              'Heart Rate': vital.heart_rate,
              SPO2: vital.spo2,
          }
      };

      const predictions = await estimateHealthMetrics(predictionInput);

      // 4. Evaluate alert conditions based on AI output and fixed thresholds
      const alertMessages: string[] = [];
      let alert_severity: 'Critical' | 'High' = 'High';

      // Check direct vitals against thresholds
      if (vital.heart_rate > (patientProfile.alert_threshold_hr_high || 120)) {
        alertMessages.push(`Critical heart rate detected: ${vital.heart_rate.toFixed(0)} BPM.`);
        alert_severity = 'Critical';
      }
      if (vital.spo2 < (patientProfile.alert_threshold_spo2_low || 92)) {
        alertMessages.push(`Critically Low SpO2 detected: ${vital.spo2.toFixed(1)}%.`);
        alert_severity = 'Critical';
      }
      
      // Check AI-driven predictions against thresholds, considering confidence
      if (predictions.estimatedSystolic > (patientProfile.alert_threshold_bp_systolic_high || 140) && predictions.confidenceScore > 0.5) {
         alertMessages.push(`AI detected high systolic BP risk: ~${predictions.estimatedSystolic.toFixed(0)} mmHg.`);
         alert_severity = 'Critical';
      }
      if (predictions.estimatedGlucose > (patientProfile.alert_threshold_glucose_high || 180) && predictions.confidenceScore > 0.5) {
         alertMessages.push(`AI detected high blood glucose risk: ~${predictions.estimatedGlucose.toFixed(0)} mg/dL.`);
         alert_severity = 'Critical';
      }

      const alert_flag = alertMessages.length > 0;
      const now = new Date().toISOString();
      
      // 5. Construct the full health vital record using AI estimations
      const healthVitalRecord: HealthVital = {
        timestamp: vital.ts,
        device_id: vital.deviceId,
        heart_rate: vital.heart_rate,
        spo2: vital.spo2,
        ppg_raw: vital.ppg_raw,
        predicted_bp_systolic: predictions.estimatedSystolic,
        predicted_bp_diastolic: predictions.estimatedDiastolic,
        predicted_glucose: predictions.estimatedGlucose,
        alert_flag: alert_flag,
        created_at: now,
        confidence_score: predictions.confidenceScore,
      };
      
      const healthVitalRow = [
          healthVitalRecord.timestamp,
          healthVitalRecord.device_id,
          healthVitalRecord.heart_rate,
          healthVitalRecord.spo2,
          healthVitalRecord.ppg_raw,
          healthVitalRecord.predicted_bp_systolic,
          healthVitalRecord.predicted_bp_diastolic,
          healthVitalRecord.predicted_glucose,
          healthVitalRecord.alert_flag,
          healthVitalRecord.created_at,
          healthVitalRecord.confidence_score,
      ];

      // 6. Save vitals to GridDB
      await putRows('health_vitals', [healthVitalRow]);
      
      finalHealthVital = healthVitalRecord; // Keep the last processed vital for reporting

      // 7. If alert triggered, save to GridDB and send Telegram notification
      if (alert_flag) {
        const alert_message = alertMessages.join(' ');
        const alertRecord: AlertHistory = {
            alert_timestamp: vital.ts,
            alert_id: randomUUID(),
            device_id: vital.deviceId,
            patient_id: patientProfile.patient_id,
            alert_type: "AI/Vital Threshold Exceeded",
            severity: alert_severity,
            alert_message: alert_message,
            heart_rate: vital.heart_rate,
            spo2: vital.spo2,
            ppg_raw: vital.ppg_raw,
            predicted_glucose: healthVitalRecord.predicted_glucose,
            predicted_bp_systolic: healthVitalRecord.predicted_bp_systolic,
            predicted_bp_diastolic: healthVitalRecord.predicted_bp_diastolic,
            confidence_score: predictions.confidenceScore,
            acknowledged: false,
            created_at: now
        };
        const alertRow = [
            alertRecord.alert_timestamp,
            alertRecord.alert_id,
            alertRecord.device_id,
            alertRecord.patient_id,
            alertRecord.alert_type,
            alertRecord.severity,
            alertRecord.alert_message,
            alertRecord.heart_rate,
            alertRecord.spo2,
            alertRecord.ppg_raw,
            alertRecord.predicted_bp_systolic,
            alertRecord.predicted_bp_diastolic,
            alertRecord.predicted_glucose,
            alertRecord.confidence_score,
            alertRecord.acknowledged,
            alertRecord.acknowledged_at || null,
            alertRecord.created_at,
        ];
        await putRows('alert_history', [alertRow]);
        
        // Send Telegram alert to Doctor/Clinic
        if (process.env.TELEGRAM_CHAT_ID) {
          await sendCriticalAlert(process.env.TELEGRAM_CHAT_ID, alert_severity, `Patient ${patientProfile.name}: ${alert_message}`);
        }
      }
    }

    // 8. If the request came from Telegram, send the full report back to the patient
    if (chatId && finalHealthVital) {
      await sendHealthReport(chatId, finalHealthVital);
    }

    return NextResponse.json({ message: 'Vitals ingested, analyzed, and stored successfully.' });

  } catch (error: any) {
    console.error('[/api/vitals] Error:', error);
    const chatId = body.chatId || process.env.TELEGRAM_CHAT_ID;
    if (chatId) {
        await sendCriticalAlert(chatId, 'Critical', 'Failed to process vitals. System error.');
    }
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
