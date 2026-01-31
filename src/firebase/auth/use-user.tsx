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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
      // Firebase might not be initialized yet, especially on server render.
      // We'll wait for the instances to be available.
      if (typeof window !== 'undefined') {
        // If we are on the client and instances are null, something is wrong with init.
        // But we set loading to false to avoid an infinite loading state.
        setLoading(false);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(authUser);
        const userDocRef = doc(firestore, 'users', authUser.uid);

        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // This can happen if profile creation is delayed or fails.
            // Or if a user exists in Auth but not in Firestore.
            setUserProfile(null);
          }
          // We have a definitive answer about auth and profile.
          setLoading(false);
        }, (error) => {
           console.error("Error fetching user profile:", error);
           setUserProfile(null);
           setLoading(false);
        });
        
        // Return the profile listener cleanup function
        return () => unsubscribeProfile();

      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, userProfile, loading };
}
