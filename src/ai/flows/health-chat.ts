'use server';

/**
 * @fileOverview An AI agent to answer patient questions based on their health data.
 *
 * - getHealthChatResponse - A function that handles the chat process.
 * - HealthChatInput - The input type for the getHealthChatResponse function.
 * - HealthChatOutput - The return type for the getHealthChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthChatInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
  vitalsContext: z
    .string()
    .describe(
      'A JSON string of recent health vitals for context. Includes heart_rate, spo2, temperature, and AI-estimated glucose and blood pressure.'
    ),
});
export type HealthChatInput = z.infer<typeof HealthChatInputSchema>;

const HealthChatOutputSchema = z.object({
  answer: z
    .string()
    .describe('A helpful, medically-informed answer to the user\'s question.'),
});
export type HealthChatOutput = z.infer<typeof HealthChatOutputSchema>;

export async function getHealthChatResponse(
  input: HealthChatInput
): Promise<HealthChatOutput> {
  return healthChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthChatPrompt',
  input: { schema: HealthChatInputSchema },
  output: { schema: HealthChatOutputSchema },
  prompt: `You are a helpful and empathetic medical AI assistant for VitalWatch. Your role is to answer user questions about their health based on the data provided.

**IMPORTANT:** You are NOT a doctor. You MUST NOT provide a diagnosis. Always end your response with a clear disclaimer reminding the user to consult a healthcare professional for medical decisions.

**User's Recent Health Data:**
\`\`\`json
{{{vitalsContext}}}
\`\`\`

Based on this data, please answer the following question. Be clear, concise, and use easy-to-understand language.

**User's Question:** "{{{question}}}"

`,
});

const healthChatFlow = ai.defineFlow(
  {
    name: 'healthChatFlow',
    inputSchema: HealthChatInputSchema,
    outputSchema: HealthChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
