import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface Prompt {
  id?: string;
  originalText: string;
  enhancedText: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function savePrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Timestamp.now();
  const promptData = {
    ...prompt,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb.collection('prompts').add(promptData);
  return docRef.id;
}

export async function getUserPrompts(userId: string): Promise<Prompt[]> {
  const snapshot = await adminDb
    .collection('prompts')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<Prompt, 'id'>,
  }));
}

export async function getPromptById(promptId: string): Promise<Prompt | null> {
  const doc = await adminDb.collection('prompts').doc(promptId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data() as Omit<Prompt, 'id'>,
  };
}

export async function updatePrompt(promptId: string, data: Partial<Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  await adminDb.collection('prompts').doc(promptId).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePrompt(promptId: string): Promise<void> {
  await adminDb.collection('prompts').doc(promptId).delete();
} 