'use client';

import { getFirebase } from '.';
import { FirebaseProvider } from './provider';

// This component ensures that Firebase is initialized only once on the client
// and provides the initialized instances to its children.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = getFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
