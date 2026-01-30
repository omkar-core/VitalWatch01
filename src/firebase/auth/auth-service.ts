'use client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '..';
import type { UserRole, PatientProfile } from '@/lib/types';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const { auth, firestore } = getFirebase();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=random`;

  // Update profile in Firebase Auth
  await updateProfile(user, { displayName, photoURL: avatarUrl });

  // Create user document in Firestore for role management
  const userRef = doc(firestore, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    role: role,
    avatarUrl: avatarUrl,
    createdAt: serverTimestamp(),
  });

  // If the user is a patient, create a corresponding patient_profile in GridDB
  if (role === 'patient') {
    const now = new Date().toISOString();
    const newProfile: PatientProfile = {
      patient_id: user.uid,
      device_id: `device_${user.uid.substring(0, 8)}`, // Assign a default device ID
      name: displayName,
      email: email,
      is_active: true,
      created_at: now,
      updated_at: now,
      age: 0,
      gender: 'Other',
      phone: '',
      avatar_url: avatarUrl,
      baseline_hr: 0,
      baseline_spo2: 0,
      baseline_bp_systolic: 0,
      baseline_bp_diastolic: 0,
      has_diabetes: false,
      has_hypertension: false,
      has_heart_condition: false,
      alert_threshold_hr_high: 120,
      alert_threshold_hr_low: 50,
      alert_threshold_spo2_low: 92,
      alert_threshold_bp_systolic_high: 140,
      alert_threshold_glucose_high: 180,
      emergency_contact_name: '',
      emergency_contact_phone: '',
    };

    // Fire-and-forget the profile creation to make the UI faster.
    // The dashboard will handle the brief period where the profile might not exist yet.
    fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile),
    }).catch((e) => {
      console.error(
        'Failed to create patient profile in GridDB in the background:',
        e
      );
      // In a real app, you might add this to a retry queue or notify an admin.
    });
  }

  return user;
}

export async function login(email: string, password: string) {
  const { auth } = getFirebase();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const { auth } = getFirebase();
  return signOut(auth);
}
