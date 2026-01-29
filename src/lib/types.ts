export type Vital = {
  time: string;
  "Glucose": number;
  "Systolic": number;
  "Diastolic": number;
  "Heart Rate": number;
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
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Predictive';
  message: string;
  timestamp: string;
  isRead: boolean;
  trend: string;
  prediction: string;
};

export type UserRole = 'doctor' | 'patient';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole | 'admin';
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
