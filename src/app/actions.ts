"use server";

import type { HealthVital, PatientProfile, AlertHistory, ESP32Data } from '@/lib/types';
import { sendTelegramAlert } from "@/lib/telegram";
import { estimateHealthMetrics, EstimateHealthMetricsInput } from "@/ai/flows/suggest-initial-diagnoses";

type ActionResult<T> = {
    data?: T;
    error?: string;
}

export async function ingestVitalsAction(vitals: ESP32Data[]): Promise<ActionResult<string>> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vitals/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitals),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || 'Failed to ingest vitals data.');
    }

    const result = await response.json();
    return { data: result.message };

  } catch (e: any) {
    console.error("Error in ingestVitalsAction:", e);
    return { error: e.message || 'An unknown error occurred during the vitals ingestion process.' };
  }
}
