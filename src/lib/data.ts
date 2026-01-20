import type { Patient, Alert, User, Device, PricingTier } from '@/lib/types';
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
    name: 'John Doe',
    age: 68,
    gender: 'Male',
    avatarUrl: patientAvatar1?.imageUrl ?? '',
    avatarHint: patientAvatar1?.imageHint ?? '',
    status: 'Critical',
    lastSeen: '2 min ago',
    symptoms: 'Chest pain, shortness of breath, dizziness.',
    medicalHistory: 'History of hypertension and a previous myocardial infarction in 2020. Allergic to penicillin.',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    vitals: [
      { time: '08:00', "Heart Rate": 95, "Blood Pressure": '145/92', "SPO2": 93, "Temperature": 37.1 },
      { time: '09:00', "Heart Rate": 102, "Blood Pressure": '150/96', "SPO2": 92, "Temperature": 37.2 },
      { time: '10:00', "Heart Rate": 110, "Blood Pressure": '155/98', "SPO2": 91, "Temperature": 37.3 },
      { time: '11:00', "Heart Rate": 105, "Blood Pressure": '152/95', "SPO2": 92, "Temperature": 37.2 },
      { time: '12:00', "Heart Rate": 115, "Blood Pressure": '160/100', "SPO2": 90, "Temperature": 37.4 },
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
      { time: '08:00', "Heart Rate": 72, "Blood Pressure": '120/80', "SPO2": 98, "Temperature": 36.8 },
      { time: '09:00', "Heart Rate": 75, "Blood Pressure": '122/81', "SPO2": 98, "Temperature": 36.9 },
      { time: '10:00', "Heart Rate": 74, "Blood Pressure": '121/80', "SPO2": 99, "Temperature": 36.8 },
      { time: '11:00', "Heart Rate": 76, "Blood Pressure": '123/82', "SPO2": 98, "Temperature": 37.0 },
      { time: '12:00', "Heart Rate": 73, "Blood Pressure": '120/79', "SPO2": 99, "Temperature": 36.9 },
    ],
  },
  {
    id: 'p003',
    name: 'Robert Johnson',
    age: 72,
    gender: 'Male',
    avatarUrl: patientAvatar3?.imageUrl ?? '',
    avatarHint: patientAvatar3?.imageHint ?? '',
    status: 'Needs Review',
    lastSeen: '5 min ago',
    symptoms: 'Persistent cough, low-grade fever.',
    medicalHistory: 'COPD diagnosed 5 years ago. Uses an inhaler daily.',
    conditions: ['COPD'],
    vitals: [
      { time: '08:00', "Heart Rate": 88, "Blood Pressure": '130/85', "SPO2": 94, "Temperature": 37.5 },
      { time: '09:00', "Heart Rate": 90, "Blood Pressure": '132/86', "SPO2": 93, "Temperature": 37.6 },
      { time: '10:00', "Heart Rate": 92, "Blood Pressure": '135/88', "SPO2": 93, "Temperature": 37.8 },
      { time: '11:00', "Heart Rate": 91, "Blood Pressure": '134/87', "SPO2": 94, "Temperature": 37.7 },
      { time: '12:00', "Heart Rate": 94, "Blood Pressure": '136/89', "SPO2": 92, "Temperature": 37.9 },
    ],
  },
  {
    id: 'p004',
    name: 'Emily Williams',
    age: 31,
    gender: 'Female',
    avatarUrl: patientAvatar4?.imageUrl ?? '',
    avatarHint: patientAvatar4?.imageHint ?? '',
    status: 'Stable',
    lastSeen: '30 min ago',
    symptoms: 'None reported. Routine monitoring post-appendectomy.',
    medicalHistory: 'Appendectomy 3 days ago. Recovering well.',
    conditions: ['Post-operative'],
    vitals: [
      { time: '08:00', "Heart Rate": 65, "Blood Pressure": '110/70', "SPO2": 99, "Temperature": 36.7 },
      { time: '09:00', "Heart Rate": 68, "Blood Pressure": '112/72', "SPO2": 99, "Temperature": 36.8 },
      { time: '10:00', "Heart Rate": 66, "Blood Pressure": '111/71', "SPO2": 99, "Temperature": 36.7 },
      { time: '11:00', "Heart Rate": 67, "BloodPressure": '113/73', "SPO2": 99, "Temperature": 36.9 },
      { time: '12:00', "Heart Rate": 65, "Blood Pressure": '110/70', "SPO2": 99, "Temperature": 36.8 },
    ],
  },
];

export const alerts: Alert[] = [
  {
    id: 'a001',
    patientId: 'p001',
    patientName: 'John Doe',
    severity: 'High',
    message: 'SPO2 dropped to 90%',
    timestamp: '2 min ago',
    isRead: false,
  },
  {
    id: 'a002',
    patientId: 'p001',
    patientName: 'John Doe',
    severity: 'Medium',
    message: 'Heart rate sustained above 110 bpm',
    timestamp: '3 min ago',
    isRead: false,
  },
  {
    id: 'a003',
    patientId: 'p003',
    patientName: 'Robert Johnson',
    severity: 'Medium',
    message: 'Sustained SPO2 drop to 92%',
    timestamp: '10 min ago',
    isRead: true,
  },
  {
    id: 'a004',
    patientId: 'p003',
    patientName: 'Robert Johnson',
    severity: 'Low',
    message: 'Temperature elevated to 37.9°C',
    timestamp: '12 min ago',
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
    name: 'John Doe',
    email: 'j.doe@email.com',
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
        assignedTo: 'John Doe (p001)',
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
        assignedTo: 'Robert Johnson (p003)',
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
        assignedTo: 'Emily Williams (p004)',
        lastSync: '3 days ago',
    }
];

export const pricingTiers: PricingTier[] = [
    {
      name: "Pilot Program",
      price: "Free",
      period: "for first 500 patients",
      description: "Ideal for new clinics and pilot studies to validate our platform's impact.",
      features: [
        "Up to 500 patients",
        "Continuous Monitoring",
        "Real-time Alerts",
        "Doctor & Patient Portals",
        "Standard Support",
      ],
      cta: "Join the Pilot",
    },
    {
      name: "Basic Plan",
      price: "₹50",
      period: "/ patient / month",
      description: "Essential features for small to medium-sized clinics.",
      features: [
        "All features from Pilot",
        "Up to 2,000 patients",
        "Basic Analytics",
        "Email & SMS Notifications",
        "Dedicated Onboarding",
      ],
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "for large-scale deployments",
      description: "Comprehensive solutions for large hospitals and district-level health programs.",
      features: [
        "All features from Basic",
        "Unlimited Patients",
        "Advanced Population Analytics",
        "API & EMR Integration",
        "24/7 Premium Support",
        "Custom Branding",
      ],
      cta: "Contact Sales",
    },
  ];
