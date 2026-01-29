import type { Patient, Alert, User, Device } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';

const patientAvatar1 = placeholderImages.find(p => p.id === 'patient-avatar-1');
const patientAvatar2 = placeholderImages.find(p => p.id === 'patient-avatar-2');
const patientAvatar3 = placeholderImages.find(p => p.id === 'patient-avatar-3');
const patientAvatar4 = placeholderImages.find(p => p.id === 'patient-avatar-4');
const patientAvatar5 = placeholderImages.find(p => p.id === 'patient-avatar-5');
const doctorAvatarMale = placeholderImages.find(p => p.id === 'doctor-avatar-male');
const doctorAvatarFemale = placeholderImages.find(p => p.id === 'doctor-avatar-female');


export const patients: Patient[] = [
  {
    id: 'p001',
    name: 'Ramaiah S.',
    age: 54,
    gender: 'Male',
    avatarUrl: patientAvatar1?.imageUrl ?? '',
    avatarHint: patientAvatar1?.imageHint ?? '',
    status: 'Critical',
    lastSeen: '2 min ago',
    symptoms: 'Chest pain, shortness of breath, dizziness.',
    medicalHistory: 'History of hypertension and a previous myocardial infarction in 2020. Allergic to penicillin.',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    vitals: [
      { time: '08:00', "Glucose": 195, "Systolic": 145, "Diastolic": 92, "Heart Rate": 88, "SPO2": 96, "Temperature": 37.1 },
      { time: '09:00', "Glucose": 250, "Systolic": 150, "Diastolic": 96, "Heart Rate": 95, "SPO2": 95, "Temperature": 37.2 },
      { time: '10:00', "Glucose": 310, "Systolic": 155, "Diastolic": 98, "Heart Rate": 102, "SPO2": 94, "Temperature": 37.3 },
      { time: '11:00', "Glucose": 340, "Systolic": 152, "Diastolic": 95, "Heart Rate": 105, "SPO2": 93, "Temperature": 37.2 },
      { time: '12:00', "Glucose": 380, "Systolic": 158, "Diastolic": 102, "Heart Rate": 92, "SPO2": 96, "Temperature": 37.4 },
    ],
  },
  {
    id: 'p002',
    name: 'Jane Smith',
    age: 45,
    gender: 'Female',
    avatarUrl: patientAvatar2?.imageUrl ?? '',
    avatarHint: patientAvatar2?.imageHint ?? '',
    status: 'Stable',
    lastSeen: '15 min ago',
    symptoms: 'Mild headache, fatigue.',
    medicalHistory: 'Diagnosed with Type 2 Diabetes, managed with Metformin. No known allergies.',
    conditions: ['Type 2 Diabetes'],
     vitals: [
      { time: '08:00', "Glucose": 120, "Systolic": 120, "Diastolic": 80, "Heart Rate": 72, "SPO2": 98, "Temperature": 36.8 },
      { time: '09:00', "Glucose": 125, "Systolic": 122, "Diastolic": 81, "Heart Rate": 75, "SPO2": 98, "Temperature": 36.9 },
      { time: '10:00', "Glucose": 130, "Systolic": 121, "Diastolic": 80, "Heart Rate": 74, "SPO2": 99, "Temperature": 36.8 },
      { time: '11:00', "Glucose": 128, "Systolic": 123, "Diastolic": 82, "Heart Rate": 76, "SPO2": 98, "Temperature": 37.0 },
      { time: '12:00', "Glucose": 122, "Systolic": 120, "Diastolic": 79, "Heart Rate": 73, "SPO2": 99, "Temperature": 36.9 },
    ],
  },
  {
    id: 'p003',
    name: 'Arun M.',
    age: 48,
    gender: 'Male',
    avatarUrl: patientAvatar3?.imageUrl ?? '',
    avatarHint: patientAvatar3?.imageHint ?? '',
    status: 'Needs Review',
    lastSeen: '5 min ago',
    symptoms: 'Persistent cough, low-grade fever.',
    medicalHistory: 'COPD diagnosed 5 years ago. Uses an inhaler daily.',
    conditions: ['COPD', 'Hypertension'],
     vitals: [
      { time: '08:00', "Glucose": 186, "Systolic": 138, "Diastolic": 88, "Heart Rate": 88, "SPO2": 94, "Temperature": 37.5 },
      { time: '09:00', "Glucose": 190, "Systolic": 140, "Diastolic": 90, "Heart Rate": 90, "SPO2": 93, "Temperature": 37.6 },
      { time: '10:00', "Glucose": 188, "Systolic": 142, "Diastolic": 91, "Heart Rate": 92, "SPO2": 93, "Temperature": 37.8 },
      { time: '11:00', "Glucose": 192, "Systolic": 141, "Diastolic": 89, "Heart Rate": 91, "SPO2": 94, "Temperature": 37.7 },
      { time: '12:00', "Glucose": 185, "Systolic": 139, "Diastolic": 88, "Heart Rate": 94, "SPO2": 92, "Temperature": 37.9 },
    ],
  },
  {
    id: 'p004',
    name: 'Savita K.',
    age: 62,
    gender: 'Female',
    avatarUrl: patientAvatar4?.imageUrl ?? '',
    avatarHint: patientAvatar4?.imageHint ?? '',
    status: 'Critical',
    lastSeen: '1 min ago',
    symptoms: 'Severe headache, blurred vision.',
    medicalHistory: 'Long-standing history of hypertension, non-compliant with medication.',
    conditions: ['Hypertension'],
    vitals: [
      { time: '08:00', "Glucose": 142, "Systolic": 180, "Diastolic": 110, "Heart Rate": 95, "SPO2": 97, "Temperature": 37.0 },
      { time: '09:00', "Glucose": 145, "Systolic": 185, "Diastolic": 115, "Heart Rate": 98, "SPO2": 96, "Temperature": 37.1 },
      { time: '10:00', "Glucose": 140, "Systolic": 190, "Diastolic": 120, "Heart Rate": 100, "SPO2": 96, "Temperature": 37.2 },
      { time: '11:00', "Glucose": 143, "Systolic": 192, "Diastolic": 122, "Heart Rate": 102, "SPO2": 95, "Temperature": 37.3 },
      { time: '12:00', "Glucose": 141, "Systolic": 195, "Diastolic": 125, "Heart Rate": 105, "SPO2": 95, "Temperature": 37.4 },
    ],
  },
];

export const alerts: Alert[] = [
  {
    id: 'a001',
    patientId: 'p001',
    patientName: 'Ramaiah S.',
    severity: 'Critical',
    message: 'High Glucose: 380 mg/dL',
    trend: 'Rising rapidly (+40 in 2 hours)',
    prediction: 'May reach 410 in 1 hour',
    timestamp: '2:34 PM',
    isRead: false,
  },
  {
    id: 'a002',
    patientId: 'p004',
    patientName: 'Savita K.',
    severity: 'Critical',
    message: 'Hypertensive Crisis: BP 195/125 mmHg',
    trend: 'Sustained high BP for 3 hours',
    prediction: 'High risk of stroke',
    timestamp: '1:58 PM',
    isRead: false,
  },
  {
    id: 'a003',
    patientId: 'p003',
    patientName: 'Arun M.',
    severity: 'High',
    message: 'Sustained SPO2 drop to 92%',
    trend: 'Fluctuating between 92-94%',
    prediction: 'Respiratory distress possible',
    timestamp: '10 min ago',
    isRead: true,
  },
  {
    id: 'a004',
    patientId: 'p003',
    patientName: 'Arun M.',
    severity: 'Medium',
    message: 'Temperature elevated to 37.9°C',
    trend: 'Slowly rising',
    prediction: 'Possible infection',
    timestamp: '12 min ago',
    isRead: false,
  },
   {
    id: 'a005',
    patientId: 'p002',
    patientName: 'Jane Smith',
    severity: 'Predictive',
    message: 'Predicted Spike: Glucose may reach 280 by 5 PM',
    trend: 'Post-lunch gradual rise detected',
    prediction: 'Confidence: 78%',
    timestamp: '3:15 PM',
    isRead: false,
  },
];

export const users: User[] = [
  {
    id: 'd001',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@clinic.com',
    role: 'doctor',
    avatarUrl: doctorAvatarFemale?.imageUrl ?? '',
    avatarHint: doctorAvatarFemale?.imageHint ?? '',
  },
  {
    id: 'p002',
    name: 'Jane Smith',
    email: 'j.smith@email.com',
    role: 'patient',
    avatarUrl: patientAvatar2?.imageUrl ?? '',
    avatarHint: patientAvatar2?.imageHint ?? '',
  },
  {
    id: 'adm001',
    name: 'Mark Chen',
    email: 'm.chen@clinic.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxhZG1pbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2ODgyNzEyMnww&ixlib=rb-4.1.0&q=80&w=200',
    avatarHint: 'admin portrait',
  },
   {
    id: 'd002',
    name: 'Dr. James Carter',
    email: 'j.carter@clinic.com',
    role: 'doctor',
    avatarUrl: doctorAvatarMale?.imageUrl ?? '',
    avatarHint: doctorAvatarMale?.imageHint ?? '',
  },
  {
    id: 'p001',
    name: 'Ramaiah S.',
    email: 'r.s@email.com',
    role: 'patient',
    avatarUrl: patientAvatar1?.imageUrl ?? '',
    avatarHint: patientAvatar1?.imageHint ?? '',
  },
];

export const devices: Device[] = [
    {
        id: 'dev-ecg-01',
        type: 'ECG Monitor',
        status: 'Active',
        assignedTo: 'Ramaiah S. (p001)',
        lastSync: '1 min ago',
    },
    {
        id: 'dev-bpm-02',
        type: 'Blood Pressure Cuff',
        status: 'Active',
        assignedTo: 'Jane Smith (p002)',
        lastSync: '15 min ago',
    },
    {
        id: 'dev-spo2-03',
        type: 'Pulse Oximeter',
        status: 'Active',
        assignedTo: 'Arun M. (p003)',
        lastSync: '5 min ago',
    },
    {
        id: 'dev-therm-04',
        type: 'Digital Thermometer',
        status: 'Inactive',
        assignedTo: 'Unassigned',
        lastSync: '2 hours ago',
    },
    {
        id: 'dev-ecg-05',
        type: 'ECG Monitor',
        status: 'Maintenance',
        assignedTo: 'Savita K. (p004)',
        lastSync: '3 days ago',
    }
];
