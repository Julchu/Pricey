// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';
import getConfig from 'next/config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const { publicRuntimeConfig } = getConfig();
const firebaseConfig = publicRuntimeConfig.firebaseConfig;
const emulatorEnabled = firebaseConfig.emulatorEnabled;

// Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const createFirebaseApp = (config = {}): FirebaseApp => {
  try {
    return getApp();
  } catch (e) {
    return initializeApp(config);
  }
};

const app = createFirebaseApp(firebaseConfig);

// const analytics = getAnalytics(app);
// const storage = getStorage(app);

/* getFirestore returns existing Firestore or creates a new one with default settings
 * initializeFirestore creates a new one with optional settings
 * Ex: const db = initializeFirestore(app, { experimentalForceLongPolling: true });
 */
const firestore = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true,
});

// Ensure emulator flag is off in production env when deploying
try {
  if (emulatorEnabled && getApps().length > 0 && firestore !== null) {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }
} catch (e) {
  console.log(e);
}

export { firestore };
