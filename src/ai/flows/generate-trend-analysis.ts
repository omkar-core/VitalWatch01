'use server';

/**
 * @fileOverview An AI agent to generate a detailed analysis of a patient's health trends over time.
 *
 * - generateTrendAnalysis - A function that handles the patient trend analysis generation process.
 * - GenerateTrendAnalysisInput - The input type for the generateTrendAnalysis function.
 * - GenerateTrendAnalysisOutput - The return type for the generateTrendAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PatientProfile, HealthVital } from '@/lib/types';


const HealthVitalSchemaForAI = z.object({
  timestamp: z.string(),
  heart_rate: z.number(),
  spo2: z.number(),
  temperature: z.number(),
  predicted_bp_systolic: z.optional(z.number()),
  predicted_bp_diastolic: z.optional(z.number()),
  predicted_glucose: z.optional(z.number()),
});


const GenerateTrendAnalysisInputSchema = z.object({
  patient_profile: z.object({
      age: z.optional(z.number()),
      gender: z.optional(z.string()),
      has_diabetes: z.optional(z.boolean()),
      has_hypertension: z.optional(z.boolean()),
      has_heart_condition: z.optional(z.boolean()),
  }),
  historical_vitals: z.array(HealthVitalSchemaForAI).describe("An array of the patient's recent historical vital signs, ordered from oldest to newest.")
});
export type GenerateTrendAnalysisInput = z.infer<typeof GenerateTrendAnalysisInputSchema>;

const GenerateTrendAnalysisOutputSchema = z.object({
  analysis: z
    .string()
    .describe("A detailed analysis of the patient's health trends, highlighting stability, improvements, or areas of concern. This should be a comprehensive paragraph, not just a single sentence."),
});
export type GenerateTrendAnalysisOutput = z.infer<typeof GenerateTrendAnalysisOutputSchema>;

export async function generateTrendAnalysis(
  input: GenerateTrendAnalysisInput
): Promise<GenerateTrendAnalysisOutput> {
  return generateTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrendAnalysisPrompt',
  input: {schema: GenerateTrendAnalysisInputSchema},
  output: {schema: GenerateTrendAnalysisOutputSchema},
  prompt: `You are an expert medical AI assistant for the VitalWatch platform. Your task is to analyze a patient's historical vital signs to identify trends and provide a summary for a doctor.

  **Patient Profile:**
  - Age: {{{patient_profile.age}}}
  - Gender: {{{patient_profile.gender}}}
  - Known Conditions: {{#if patient_profile.has_diabetes}}Diabetes, {{/if}}{{#if patient_profile.has_hypertension}}Hypertension, {{/if}}{{#if patient_profile.has_heart_condition}}Heart Condition{{/if}}

  **Historical Vitals Data (oldest to newest):**
  {{#each historical_vitals}}
  - Time: {{this.timestamp}}, HR: {{this.heart_rate}}, SpO2: {{this.spo2}}, Temp: {{this.temperature}}, Est. BP: {{this.predicted_bp_systolic}}/{{this.predicted_bp_diastolic}}, Est. Glucose: {{this.predicted_glucose}}
  {{/each}}

  **Analysis Task:**
  Based on the historical data and patient profile, provide a concise but detailed analysis of their health trends.
  
  - Identify any significant upward or downward trends in key metrics (Heart Rate, Estimated BP, Estimated Glucose).
  - Comment on the stability or volatility of the readings.
  - Highlight any readings that have crossed into warning or critical thresholds.
  - Conclude with an overall assessment of whether the patient's condition appears stable, improving, or requires attention.
  - Write the analysis in a professional, clinical tone. It should be a detailed paragraph.
`,
});

const generateTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'generateTrendAnalysisFlow',
    inputSchema: GenerateTrendAnalysisInputSchema,
    outputSchema: GenerateTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
