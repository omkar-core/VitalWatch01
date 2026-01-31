'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '..';
import type { UserProfile } from '@/lib/types';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start loading

  useEffect(() => {
    if (!auth || !firestore) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);

      if (authUser) {
        // If user is logged in, listen to their profile document
        const userDocRef = doc(firestore, 'users', authUser.uid);
        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            } else {
              // This can happen if profile creation is delayed or fails
              setUserProfile(null);
            }
            setLoading(false); // Loading is false only after we get a profile response
          },
          (error) => {
            console.error('Error fetching user profile:', error);
            setUserProfile(null);
            setLoading(false);
          }
        );

        // Return a function to cleanup the profile listener when auth state changes
        return () => unsubscribeProfile();
      } else {
        // If user is not logged in, clear profile and finish loading
        setUserProfile(null);
        setLoading(false);
      }
    });

    // Return a function to cleanup the auth listener on component unmount
    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, userProfile, loading };
}
