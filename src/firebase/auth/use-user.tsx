'use client';

import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { useDoc } from '../firestore/use-doc';
import type { UserProfile } from '@/lib/types';

export const useUser = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoadingUser(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const userProfileRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: loadingProfile, error: profileError } = useDoc<UserProfile>(userProfileRef);

  return { 
    user, 
    userProfile: userProfile || null, 
    loading: loadingUser || loadingProfile,
    error: profileError
  };
};
