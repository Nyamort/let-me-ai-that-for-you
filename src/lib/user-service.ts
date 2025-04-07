import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id?: string;
  email?: string;
  name?: string;
  image?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function saveUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Timestamp.now();
  const userData = {
    ...user,
    createdAt: now,
    updatedAt: now,
  };

  // Check if user already exists
  const userSnapshot = await adminDb
    .collection('users')
    .where('email', '==', user.email)
    .get();

  if (!userSnapshot.empty) {
    const existingUser = userSnapshot.docs[0];
    // Update existing user
    await adminDb.collection('users').doc(existingUser.id).update({
      ...user,
      updatedAt: now,
    });
    return existingUser.id;
  }

  // Create new user
  const docRef = await adminDb.collection('users').add(userData);
  return docRef.id;
}

export async function getUserById(userId: string): Promise<User | null> {
  const doc = await adminDb.collection('users').doc(userId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data() as Omit<User, 'id'>,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const snapshot = await adminDb
    .collection('users')
    .where('email', '==', email)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data() as Omit<User, 'id'>,
  };
}

export async function updateUser(userId: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  await adminDb.collection('users').doc(userId).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
} 