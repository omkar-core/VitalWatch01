import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'doctor' | 'patient';

export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;
  gender?: string;
  conditions?: string[];
  medicalHistory?: string;
  status?: 'Stable' | 'Needs Review' | 'Critical';
  lastSeen?: string;
  deviceId?: string;
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
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface HealthVital {
    timestamp: string;
    device_id: string;
    heart_rate: number;
    spo2: number;
    ppg_raw: number;
    predicted_bp_systolic?: number;
    predicted_bp_diastolic?: number;
    predicted_glucose?: number;
    alert_flag: boolean;
    created_at: string;
}

export interface AlertHistory {
    alert_timestamp: string;
    alert_id: string;
    device_id: string;
    patient_id?: string;
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
    acknowledged_at?: string;
    created_at: string;
}


export type ESP32Data = {
  deviceId: string;
  ts: string; // ISO 8601 format
  heart_rate: number;
  spo2: number;
  ppg_raw: number;
};
