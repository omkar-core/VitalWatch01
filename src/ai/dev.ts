import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-initial-diagnoses.ts';
import '@/ai/flows/generate-patient-summary.ts';