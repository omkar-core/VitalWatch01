'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  children: React.ReactNode;
  value: FirebaseContextType;
}> = ({ children, value }) => {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const { app } = useFirebase();
  if (!app) {
    throw new Error('Firebase app not available');
  }
  return app;
};

export const useAuth = () => {
  const { auth } = useFirebase();
  if (!auth) {
    throw new Error('Firebase Auth not available');
  }
  return auth;
};

export const useFirestore = () => {
  const { firestore } = useFirebase();
  if (!firestore) {
    throw new Error('Firestore not available');
  }
  return firestore;
};
