'use client';

import * as React from 'react';
import { getFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// This component ensures that Firebase is initialized only once on the client
// and provides the initialized instances to its children.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use state to hold the initialized Firebase instances.
  // This prevents initialization during server-side rendering.
  const [firebase, setFirebase] = React.useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  } | null>(null);

  React.useEffect(() => {
    // The useEffect hook runs only on the client, after the component mounts.
    // This is the correct place to initialize Firebase.
    const instances = getFirebase();
    setFirebase(instances);
  }, []);

  // If Firebase is not yet initialized OR if initialization failed,
  // we render the children without the provider. The hooks will gracefully handle null.
  if (!firebase || !firebase.app || !firebase.auth || !firebase.firestore) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider app={firebase.app} auth={firebase.auth} firestore={firebase.firestore}>
      {children}
    </FirebaseProvider>
  );
}
