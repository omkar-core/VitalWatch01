import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-initial-diagnoses';
import '@/ai/flows/generate-patient-summary';
import '@/ai/flows/health-chat';
