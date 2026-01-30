"use server";

import { generatePatientSummary, GeneratePatientSummaryInput } from "@/ai/flows/generate-patient-summary";
import { estimateHealthMetrics, EstimateHealthMetricsInput } from "@/ai/flows/suggest-initial-diagnoses";

type ActionResult<T> = {
    data?: T;
    error?: string;
}

export async function generatePatientSummaryAction(input: GeneratePatientSummaryInput): Promise<ActionResult<Awaited<ReturnType<typeof generatePatientSummary>>>> {
    try {
        const output = await generatePatientSummary(input);
        return { data: output };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unknown error occurred.' };
    }
}

export async function estimateHealthMetricsAction(input: EstimateHealthMetricsInput): Promise<ActionResult<Awaited<ReturnType<typeof estimateHealthMetrics>>>> {
    try {
        const output = await estimateHealthMetrics(input);
        return { data: output };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unknown error occurred.' };
    }
}
