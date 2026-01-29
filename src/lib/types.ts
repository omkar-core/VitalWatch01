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
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl: string;
  avatarHint: string;
  status: 'Stable' | 'Critical' | 'Needs Review';
  lastSeen: string; // This would likely be a timestamp in a real app
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
  timestamp: string; // This would be a Firestore Timestamp in a real app
  isRead: boolean;
  trend: string;
  prediction: string;
};

export type UserRole = 'doctor' | 'patient' | 'admin';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  deviceId?: string;
};


export type Device = {
  id: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  assignedTo: string;
  lastSync: string;
};
