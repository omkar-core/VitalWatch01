'use client';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '../index';
import type { UserProfile } from '@/lib/types';

const { auth, firestore } = initializeFirebase();

export async function signUpWithEmail(values: any) {
  try {
    const { email, password, name, role } = values;
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: name,
      role: role,
      avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
    };

    if (role === 'patient') {
        userProfile.age = values.age;
        userProfile.gender = values.gender;
    }

    await setDoc(doc(firestore, 'users', user.uid), userProfile);
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    let errorMessage = "An unknown error occurred.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
    }
    return { user: null, error: errorMessage };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;

    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Default to 'patient' role for new Google sign-ups, as role is not specified in this flow
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'New User',
        role: 'patient',
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
      };
      await setDoc(userDocRef, userProfile);
    }
    
    return { user, error: null };
  } catch (error: any) {
    let errorMessage = 'Could not sign in with Google. Please try again.';
    if (error.code === 'auth/popup-closed-by-user') {
        return { user: null, error: null }; // Not really an error, user just closed the popup
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials. Please sign in using the original method."
    }
    return { user: null, error: errorMessage };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}
