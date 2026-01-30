import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebase } from '@/firebase';

// This API route uses Firestore directly because user roles and basic auth info
// are stored there, separate from the GridDB patient clinical data.

export async function GET() {
  try {
    const { firestore } = getFirebase();
    const usersCollection = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = usersSnapshot.docs.map(doc => doc.data());

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('[/api/users] Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
