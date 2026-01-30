import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function ensures that we initialize Firebase only once, and only on the client.
function getFirebase() {
  // Check if we are on the client side
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
    } else {
      app = getApp();
      auth = getAuth(app);
      firestore = getFirestore(app);
    }
    return { app, auth, firestore };
  }
  
  // On the server, we return a dummy object with null values.
  // This code is only reached during the build process for static analysis.
  // The functions that use these values (e.g., login, signUp) are only
  // ever called on the client, so this path is safe.
  return { app: null, auth: null, firestore: null } as unknown as {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  };
}

// Export the initialization function and hooks
export { getFirebase };
export { useApp, useAuth, useFirestore } from './provider';
export { useUser } from './auth/use-user';
