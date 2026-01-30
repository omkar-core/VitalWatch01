import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'doctor' | 'patient' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface PatientProfile {
  patient_id: string; // The unique ID of the patient, matches the auth UID.
  device_id: string;
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  email?: string;
  phone?: string;
  baseline_hr?: number;
  baseline_spo2?: number;
  baseline_bp_systolic?: number;
  baseline_bp_diastolic?: number;
  has_diabetes?: boolean;
  has_hypertension?: boolean;
  has_heart_condition?: boolean;
  alert_threshold_hr_high?: number;
  alert_threshold_hr_low?: number;
  alert_threshold_spo2_low?: number;
  alert_threshold_bp_systolic_high?: number;
  alert_threshold_glucose_high?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  is_active: boolean;
  avatarUrl?: string; // Added for UI consistency
}

export interface HealthVital {
  id?: string;
  timestamp: Timestamp;
  device_id: string;
  heart_rate: number;
  spo2: number;
  ppg_raw: number;
  predicted_bp_systolic?: number;
  predicted_bp_diastolic?: number;
  predicted_glucose?: number;
  alert_flag: boolean;
  created_at: Timestamp;
}

export interface AlertHistory {
  id?: string;
  alert_timestamp: Timestamp;
  alert_id: string;
  device_id: string;
  patient_id: string;
  patientName?: string; // Added for UI convenience
  alert_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  alert_message: string;
  heart_rate?: number;
  spo2?: number;
  ppg_raw?: number;
  predicted_bp_systolic?: number;
  predicted_bp_diastolic?: number;
  predicted_glucose?: number;
  acknowledged: boolean;
  acknowledged_at?: Timestamp;
  created_at: Timestamp;
}

export type ESP32Data = {
  deviceId: string;
  ts: string; // ISO 8601 format
  heart_rate: number;
  spo2: number;
  ppg_raw: number;
};
