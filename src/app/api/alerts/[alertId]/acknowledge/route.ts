import { NextRequest, NextResponse } from 'next/server';
import { getRows, putRows } from '@/lib/griddb-client';
import type { AlertHistory } from '@/lib/types';

export async function POST(
  request: NextRequest
) {
  // The URL will be like /api/alerts/some-alert-id/acknowledge
  const pathname = new URL(request.url).pathname;
  const parts = pathname.split('/');
  // Expected: ['', 'api', 'alerts', '{alertId}', 'acknowledge']
  const alertId = parts[3];


  if (!alertId) {
    return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the existing alert
    const alertResults = await getRows('alert_history', `alert_id='${alertId}'`);

    if (!alertResults || !alertResults.results || alertResults.results.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const columns = alertResults.columns;
    const values = alertResults.results[0];

    // Reconstruct the alert object from GridDB response
    const existingAlert = columns.reduce((obj: any, col: any, index: number) => {
        obj[col.name] = values[index];
        return obj;
    }, {}) as AlertHistory;

    // 2. Update the fields
    existingAlert.acknowledged = true;
    existingAlert.acknowledged_at = new Date().toISOString();

    // 3. Prepare the row for GridDB PUT operation. Order must be precise.
    const updatedAlertRow = [
      existingAlert.alert_timestamp,
      existingAlert.alert_id,
      existingAlert.device_id,
      existingAlert.patient_id,
      existingAlert.alert_type,
      existingAlert.severity,
      existingAlert.alert_message,
      existingAlert.heart_rate,
      existingAlert.spo2,
      existingAlert.temperature || null,
      existingAlert.ppg_raw,
      existingAlert.predicted_bp_systolic,
      existingAlert.predicted_bp_diastolic,
      existingAlert.predicted_glucose,
      existingAlert.confidence_score,
      existingAlert.acknowledged, // updated
      existingAlert.acknowledged_at, // updated
      existingAlert.created_at,
    ];

    // 4. Write the updated row back to GridDB
    await putRows('alert_history', [updatedAlertRow]);

    return NextResponse.json({ message: 'Alert acknowledged successfully', alert: existingAlert });

  } catch (error: any) {
    console.error(`[/api/alerts/${alertId}/acknowledge] POST Error:`, error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
