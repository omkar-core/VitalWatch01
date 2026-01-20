export type Vital = {
  time: string;
  "Heart Rate": number;
  "Blood Pressure": string;
  "SPO2": number;
  "Temperature": number;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  avatarUrl: string;
  avatarHint: string;
  status: 'Stable' | 'Critical' | 'Needs Review';
  lastSeen: string;
  symptoms: string;
  medicalHistory: string;
  conditions: string[];
  vitals: Vital[];
};

export type Alert = {
  id: string;
  patientId: string;
  patientName: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
  isRead: boolean;
};

export type UserRole = 'doctor' | 'patient' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  avatarHint: string;
};

export type Device = {
  id: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  assignedTo: string;
  lastSync: string;
};

export type PricingTier = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
};
