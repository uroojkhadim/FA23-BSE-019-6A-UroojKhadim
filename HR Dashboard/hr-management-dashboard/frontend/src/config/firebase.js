import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('🔍 Loading Firebase config from environment variables...');
console.log('📋 import.meta.env:', import.meta.env);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('⚙️ Loaded Firebase config:', firebaseConfig);

// Validate required config values
const requiredConfigFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingFields = requiredConfigFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  const errorMsg = `❌ Firebase config missing fields: ${missingFields.join(', ')}. Check your .env file!`;
  console.error(errorMsg);
  // Don't show alert, just log!
}

// Initialize Firebase (ensure only one instance)
let app;
if (!getApps().length) {
  try {
    console.log('🚀 Initializing Firebase app...');
    app = initializeApp(firebaseConfig);
  } catch (e) {
    console.warn('⚠️ Failed to initialize Firebase, using demo mode:', e);
    // Initialize with dummy config to prevent errors
    app = initializeApp({
      apiKey: 'demo',
      authDomain: 'demo.firebaseapp.com',
      projectId: 'demo',
      storageBucket: 'demo.appspot.com',
      messagingSenderId: 'demo',
      appId: 'demo'
    });
  }
} else {
  console.log('✅ Using existing Firebase app...');
  app = getApp();
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
