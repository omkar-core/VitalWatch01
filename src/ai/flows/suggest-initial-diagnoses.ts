'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting potential initial diagnoses based on patient symptoms and medical history.
 *
 * - suggestInitialDiagnoses - A function that takes patient information and returns a list of potential diagnoses.
 * - SuggestInitialDiagnosesInput - The input type for the suggestInitialDiagnoses function.
 * - SuggestInitialDiagnosesOutput - The output type for the suggestInitialDiagnoses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInitialDiagnosesInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma-separated list of symptoms the patient is experiencing.'),
  medicalHistory:
    z.string().describe('A summary of the patient\'s relevant medical history.'),
});

export type SuggestInitialDiagnosesInput = z.infer<
  typeof SuggestInitialDiagnosesInputSchema
>;

const SuggestInitialDiagnosesOutputSchema = z.object({
  diagnoses: z
    .array(z.string())
    .describe('A list of potential initial diagnoses, ordered by likelihood.'),
  reasoning:
    z.string().describe('The reasoning behind the suggested diagnoses.'),
});

export type SuggestInitialDiagnosesOutput = z.infer<
  typeof SuggestInitialDiagnosesOutputSchema
>;

export async function suggestInitialDiagnoses(
  input: SuggestInitialDiagnosesInput
): Promise<SuggestInitialDiagnosesOutput> {
  return suggestInitialDiagnosesFlow(input);
}

const suggestInitialDiagnosesPrompt = ai.definePrompt({
  name: 'suggestInitialDiagnosesPrompt',
  input: {schema: SuggestInitialDiagnosesInputSchema},
  output: {schema: SuggestInitialDiagnosesOutputSchema},
  prompt: `You are an experienced doctor providing potential initial diagnoses based on patient information.

  Consider the following symptoms and medical history to suggest a list of potential diagnoses, ordered by likelihood.
  Explain your reasoning behind the suggestions.

  Symptoms: {{{symptoms}}}
  Medical History: {{{medicalHistory}}}

  Format your response as a JSON object with 'diagnoses' (an array of strings) and 'reasoning' (a string).
  `,
});

const suggestInitialDiagnosesFlow = ai.defineFlow(
  {
    name: 'suggestInitialDiagnosesFlow',
    inputSchema: SuggestInitialDiagnosesInputSchema,
    outputSchema: SuggestInitialDiagnosesOutputSchema,
  },
  async input => {
    const {output} = await suggestInitialDiagnosesPrompt(input);
    return output!;
  }
);
