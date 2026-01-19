"use server";

import { generatePatientSummary, GeneratePatientSummaryInput } from "@/ai/flows/generate-patient-summary";
import { suggestInitialDiagnoses, SuggestInitialDiagnosesInput } from "@/ai/flows/suggest-initial-diagnoses";

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

export async function suggestInitialDiagnosesAction(input: SuggestInitialDiagnosesInput): Promise<ActionResult<Awaited<ReturnType<typeof suggestInitialDiagnoses>>>> {
    try {
        const output = await suggestInitialDiagnoses(input);
        return { data: output };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'An unknown error occurred.' };
    }
}
