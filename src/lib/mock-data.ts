import type { UserProfile, Vital, Alert, Device, Appointment, EstimateHealthMetricsOutput } from './types';

export const mockAdmin: UserProfile = {
  uid: 'admin-user-01',
  email: 'admin@vital.watch',
  displayName: 'Admin User',
  role: 'admin',
  avatarUrl: 'https://i.pravatar.cc/150?u=admin-user-01',
};

export const mockDoctor: UserProfile = {
  uid: 'doctor-user-01',
  email: 'doctor@vital.watch',
  displayName: 'Dr. Evelyn Reed',
  role: 'doctor',
  avatarUrl: 'https://i.pravatar.cc/150?u=doctor-user-01',
};

export const mockPatients: UserProfile[] = [
  {
    uid: 'patient-user-01',
    email: 'ramaiah@vital.watch',
    displayName: 'Ramaiah S.',
    role: 'patient',
    avatarUrl: 'https://i.pravatar.cc/150?u=patient-user-01',
    age: 68,
    gender: 'Male',
    conditions: ['Diabetes Type 2', 'Hypertension'],
    medicalHistory: 'Long-standing history of Type 2 Diabetes Mellitus, managed with oral hypoglycemics. Developed hypertension 5 years ago.',
    status: 'Needs Review',
    lastSeen: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    deviceId: 'CGM_LIBRE_45678'
  },
  {
    uid: 'patient-user-02',
    email: 'sarah@vital.watch',
    displayName: 'Sarah Johnson',
    role: 'patient',
    avatarUrl: 'https://i.pravatar.cc/150?u=patient-user-02',
    age: 45,
    gender: 'Female',
    conditions: ['Hypertension'],
    medicalHistory: 'Diagnosed with hypertension 2 years ago. No other significant medical history.',
    status: 'Stable',
    lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    deviceId: 'BP_MONITOR_XYZ'
  },
    {
    uid: 'patient-user-03',
    email: 'michael@vital.watch',
    displayName: 'Michael Chen',
    role: 'patient',
    avatarUrl: 'https://i.pravatar.cc/150?u=patient-user-03',
    age: 72,
    gender: 'Male',
    conditions: ['Diabetes Type 1', 'Atrial Fibrillation'],
    medicalHistory: 'Type 1 diabetic since age 12. History of atrial fibrillation, on anticoagulants.',
    status: 'Critical',
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deviceId: 'ADV_VITALS_PATCH'
  },
];

export const mockAllUsers: UserProfile[] = [mockAdmin, mockDoctor, ...mockPatients];

export const mockVitals: { [patientId: string]: Vital[] } = {
  'patient-user-01': Array.from({ length: 20 }).map((_, i) => ({
    id: `v${i}`,
    timestamp: { toDate: () => new Date(Date.now() - i * 3600000 * 6) }, // every 6 hours
    'Glucose': 140 + Math.round((Math.random() - 0.5) * 60),
    'Systolic': 130 + Math.round((Math.random() - 0.5) * 20),
    'Diastolic': 85 + Math.round((Math.random() - 0.5) * 10),
    'Heart Rate': 75 + Math.round((Math.random() - 0.5) * 15),
    'SPO2': 97 + Math.round(Math.random() * 2),
    'Temperature': 98.6 + (Math.random() - 0.5)
  }))
};
// Add more mock vitals for other patients if needed.
mockVitals['patient-user-02'] = mockVitals['patient-user-01'];
mockVitals['patient-user-03'] = mockVitals['patient-user-01'];


export const mockAlerts: Alert[] = [
  {
    id: 'alert-01',
    patientId: 'patient-user-03',
    patientName: 'Michael Chen',
    severity: 'Critical',
    message: 'High blood pressure category estimated by AI.',
    timestamp: { toDate: () => new Date(Date.now() - 3600000) }, // 1 hour ago
    isRead: false,
  },
  {
    id: 'alert-02',
    patientId: 'patient-user-01',
    patientName: 'Ramaiah S.',
    severity: 'High',
    message: 'Risky glucose trend detected by AI.',
    timestamp: { toDate: () => new Date(Date.now() - 7200000) }, // 2 hours ago
    isRead: false,
  },
  {
    id: 'alert-03',
    patientId: 'patient-user-02',
    patientName: 'Sarah Johnson',
    severity: 'Medium',
    message: 'Slightly elevated heart rate detected overnight.',
    timestamp: { toDate: () => new Date(Date.now() - 86400000) }, // 1 day ago
    isRead: true,
  },
];

export const mockDevices: Device[] = [
    {
        id: 'CGM_LIBRE_45678',
        type: 'CGM',
        status: 'Active',
        assignedTo: 'patient-user-01',
        lastSync: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 'BP_MONITOR_XYZ',
        type: 'BP Cuff',
        status: 'Active',
        assignedTo: 'patient-user-02',
        lastSync: new Date(Date.now() - 7200000).toISOString()
    },
    {
        id: 'ADV_VITALS_PATCH',
        type: 'Multi-Vitals Patch',
        status: 'Active',
        assignedTo: 'patient-user-03',
        lastSync: new Date(Date.now() - 1800000).toISOString()
    },
    {
        id: 'INACTIVE_DEV_001',
        type: 'CGM',
        status: 'Inactive',
        assignedTo: '',
        lastSync: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
        id: 'MAINTENANCE_DEV_002',
        type: 'BP Cuff',
        status: 'Maintenance',
        assignedTo: '',
        lastSync: new Date(Date.now() - 86400000 * 5).toISOString()
    },
];

export const mockAppointments: { [patientId: string]: Appointment[] } = {
  'patient-user-01': [
    {
        id: 'appt-01',
        patientId: 'patient-user-01',
        doctorId: 'doctor-user-01',
        doctorName: 'Dr. Evelyn Reed',
        date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        type: 'Follow-up Consultation',
    }
  ]
};

export const mockEstimations: { [patientId: string]: EstimateHealthMetricsOutput[] } = {
    'patient-user-01': [
        {
            timestamp: { toDate: () => new Date(Date.now() - 3600000) },
            estimatedBpCategory: 'Elevated',
            glucoseTrend: 'Risky',
            confidenceScore: 0.85,
            reasoning: 'Elevated heart rate and recent glucose spikes suggest a risky trend.'
        },
        {
            timestamp: { toDate: () => new Date(Date.now() - 86400000) },
            estimatedBpCategory: 'Normal',
            glucoseTrend: 'Normal',
            confidenceScore: 0.92,
            reasoning: 'Vitals appear stable within normal ranges.'
        }
    ]
};
mockEstimations['patient-user-02'] = mockEstimations['patient-user-01'];
mockEstimations['patient-user-03'] = mockEstimations['patient-user-01'];
