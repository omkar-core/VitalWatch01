'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating health metrics based on physiological signals.
 *
 * - estimateHealthMetrics - A function that takes sensor data and returns estimated health indicators.
 * - EstimateHealthMetricsInput - The input type for the estimateHealthMetrics function.
 * - EstimateHealthMetricsOutput - The output type for the estimateHealthMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EstimateHealthMetricsInputSchema = z.object({
  heartRate: z.number().describe('The user\'s current heart rate in beats per minute (BPM).'),
  spo2: z.number().describe('The user\'s current blood oxygen saturation level (SpO2) as a percentage.'),
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  medicalHistory: z.string().optional().describe('A brief summary of the user\'s relevant medical history (e.g., existing conditions like diabetes, hypertension).'),
});

export type EstimateHealthMetricsInput = z.infer<
  typeof EstimateHealthMetricsInputSchema
>;

export const EstimateHealthMetricsOutputSchema = z.object({
  estimatedBpCategory: z.enum(["Normal", "Elevated", "High", "Low"]).describe('The estimated blood pressure category.'),
  glucoseTrend: z.enum(["Normal", "Elevated", "Risky"]).describe('The estimated short-term blood glucose trend.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0-1) for the overall estimation.'),
  reasoning: z.string().describe('A brief, high-level reasoning for the estimations based on the provided inputs.'),
});

export type EstimateHealthMetricsOutput = z.infer<
  typeof EstimateHealthMetricsOutputSchema
>;

export async function estimateHealthMetrics(
  input: EstimateHealthMetricsInput
): Promise<EstimateHealthMetricsOutput> {
  return estimateHealthMetricsFlow(input);
}

const estimateHealthMetricsPrompt = ai.definePrompt({
  name: 'estimateHealthMetricsPrompt',
  input: {schema: EstimateHealthMetricsInputSchema},
  output: {schema: EstimateHealthMetricsOutputSchema},
  prompt: `You are an expert system that estimates health indicators from physiological signals. Your estimations are based on established medical correlations but are NOT a diagnosis.

  **IMPORTANT:** Do NOT claim to measure blood pressure or glucose directly. Use phrases like "estimated category" or "potential trend."

  Based on the following data from a PPG sensor and user profile, provide an estimated blood pressure category and glucose trend.

  **Input Data:**
  - Heart Rate: {{{heartRate}}} BPM
  - SpO2: {{{spo2}}}%
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Medical History: {{{medicalHistory}}}

  **Analysis Task:**
  1.  **Blood Pressure Estimation:** Based on correlations between heart rate, SpO2, and demographic data (age, gender), classify the blood pressure into one of the following categories: 'Normal', 'Elevated', 'High', 'Low'. For example, a consistently high resting heart rate may correlate with higher blood pressure.
  2.  **Glucose Trend Estimation:** Based on the inputs, infer a potential short-term glucose trend. For instance, certain patterns in heart rate variability (which you can infer from the provided signals) can be loosely correlated with glycemic changes. Classify the trend as 'Normal', 'Elevated', or 'Risky'.
  3.  **Confidence Score:** Provide an overall confidence score for your estimations from 0.0 to 1.0, where 1.0 is very confident. This score should reflect the inherent limitations of estimating BP and glucose from PPG data.
  4.  **Reasoning:** Briefly explain your reasoning. For example: "The elevated heart rate and lower SpO2 reading, combined with the patient's history of hypertension, suggest a 'High' blood pressure category."

  Generate the response in the required JSON format.
  `,
});

const estimateHealthMetricsFlow = ai.defineFlow(
  {
    name: 'estimateHealthMetricsFlow',
    inputSchema: EstimateHealthMetricsInputSchema,
    outputSchema: EstimateHealthMetricsOutputSchema,
  },
  async input => {
    const {output} = await estimateHealthMetricsPrompt(input);
    return output!;
  }
);
