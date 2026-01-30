import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function ensures that we initialize Firebase only once, and only on the client.
function getFirebase() {
  // Always return null on the server
  if (typeof window === 'undefined') {
    return { app: null, auth: null, firestore: null } as any;
  }

  // On the client, check if config is valid
  if (!firebaseConfig.apiKey) {
    console.error(
      'Firebase API Key is missing. Please check your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.'
    );
    return { app: null, auth: null, firestore: null } as any;
  }
  
  // Initialize if not already initialized
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

// Export the initialization function and hooks
export { getFirebase };
export { useApp, useAuth, useFirestore } from './provider';
export { useUser } from './auth/use-user';
