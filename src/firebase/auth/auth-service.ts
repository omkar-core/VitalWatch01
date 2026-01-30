'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '..';
import type { UserRole, PatientProfile } from '@/lib/types';
import { putRows } from '@/lib/griddb-client';

const { auth, firestore } = getFirebase();

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Update profile in Firebase Auth
  await updateProfile(user, { displayName });

  // Create user document in Firestore for role management
  const userRef = doc(firestore, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    role: role,
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

    // The GridDB client expects an array of rows, where each row is an array of values
    // in the exact order of the table schema. This is fragile. A better implementation
    // would map object properties to the correct column order.
    // For this implementation, we will assume the order matches the PatientProfile type.
    const profileRow = [
        newProfile.patient_id,
        newProfile.device_id,
        newProfile.name,
        newProfile.age,
        newProfile.gender,
        newProfile.email,
        newProfile.phone,
        newProfile.baseline_hr,
        newProfile.baseline_spo2,
        newProfile.baseline_bp_systolic,
        newProfile.baseline_bp_diastolic,
        newProfile.has_diabetes,
        newProfile.has_hypertension,
        newProfile.has_heart_condition,
        newProfile.alert_threshold_hr_high,
        newProfile.alert_threshold_hr_low,
        newProfile.alert_threshold_spo2_low,
        newProfile.alert_threshold_bp_systolic_high,
        newProfile.alert_threshold_glucose_high,
        newProfile.emergency_contact_name,
        newProfile.emergency_contact_phone,
        newProfile.created_at,
        newProfile.updated_at,
        newProfile.is_active
    ];
    
    // Note: The /api/patients route uses putRows, which we can call directly here if this file is server-side.
    // Since this is a client file, it's better to call the API endpoint.
    // For simplicity in this environment, we'll call the server-side function directly,
    // but in a real app, this should be an API call.
     try {
        await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile)
        });
    } catch(e) {
        console.error("Failed to create patient profile in GridDB", e);
        // Handle failure - maybe delete the auth user or flag for admin review
    }
  }


  return user;
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}
