export type Vital = {
  id?: string;
  time: any; // Firestore ServerTimestamp
  "Glucose": number;
  "Systolic": number;
  "Diastolic": number;
  "Heart Rate": number;
  "SPO2": number;
  "Temperature"?: number;
};

export type Patient = {
  id: string; // This is the user uid
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl: string;
  avatarHint: string;
  status: 'Stable' | 'Critical' | 'Needs Review';
  lastSeen: string;
  symptoms: string;
  medicalHistory: string;
  conditions: string[];
};

export type Alert = {
  id: string;
  patientId: string;
  patientName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Predictive';
  message: string;
  timestamp: any; // Firestore ServerTimestamp
  isRead: boolean;
};

export type UserRole = 'doctor' | 'patient' | 'admin';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  deviceId?: string;
  // Patient specific fields
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  medicalHistory?: string;
  conditions?: string[];
};


export type Device = {
  id: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  assignedTo: string;
  lastSync: string;
};
