import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';
import googleCreds from '@/../google.json';

const apps = getApps();

const firebaseAdmin = apps.length === 0 
  ? initializeApp({
      credential: cert(googleCreds as ServiceAccount)
    })
  : apps[0];

const adminDb = getFirestore(firebaseAdmin);

export { adminDb };