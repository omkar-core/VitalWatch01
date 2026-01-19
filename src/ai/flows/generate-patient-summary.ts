'use server';

/**
 * @fileOverview An AI agent to generate a concise summary of a patient's medical history and current health status.
 *
 * - generatePatientSummary - A function that handles the patient summary generation process.
 * - GeneratePatientSummaryInput - The input type for the generatePatientSummary function.
 * - GeneratePatientSummaryOutput - The return type for the generatePatientSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePatientSummaryInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe("The patient's medical history, including past illnesses, surgeries, and medications."),
  currentHealthStatus: z
    .string()
    .describe('The patient\'s current health status, including symptoms, vital signs, and recent test results.'),
});
export type GeneratePatientSummaryInput = z.infer<typeof GeneratePatientSummaryInputSchema>;

const GeneratePatientSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the patient's medical history and current health status."),
});
export type GeneratePatientSummaryOutput = z.infer<typeof GeneratePatientSummaryOutputSchema>;

export async function generatePatientSummary(
  input: GeneratePatientSummaryInput
): Promise<GeneratePatientSummaryOutput> {
  return generatePatientSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePatientSummaryPrompt',
  input: {schema: GeneratePatientSummaryInputSchema},
  output: {schema: GeneratePatientSummaryOutputSchema},
  prompt: `You are an expert medical summarizer. Your task is to generate a concise and accurate summary of a patient's medical history and current health status for a doctor to quickly understand their case before a consultation.

Medical History: {{{medicalHistory}}}
Current Health Status: {{{currentHealthStatus}}}

Concise Patient Summary:`, // Ensuring the prompt asks for a concise summary
});

const generatePatientSummaryFlow = ai.defineFlow(
  {
    name: 'generatePatientSummaryFlow',
    inputSchema: GeneratePatientSummaryInputSchema,
    outputSchema: GeneratePatientSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
