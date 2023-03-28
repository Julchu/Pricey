// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';
// import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import getConfig from 'next/config';
import { getAuth, connectAuthEmulator } from '@firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const { publicRuntimeConfig } = getConfig();
const firebaseConfig = publicRuntimeConfig.firebaseConfig;
const emulatorEnabled = firebaseConfig.emulatorEnabled as boolean;

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
// const functions = getFunctions(app);
const authentication = getAuth(app);

/* getFirestore returns existing Firestore or creates a new one with default settings
 * initializeFirestore creates a new one with optional settings
 * Ex: const db = initializeFirestore(app, { experimentalForceLongPolling: true });
 */
const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
});

// Ensure emulator flag is off in production env when deploying
try {
  // Workaround for settings/host emulator crash
  const EMULATORS_STARTED = 'EMULATORS_STARTED';

  type CacheControlGlobal = typeof global & {
    [EMULATORS_STARTED]: boolean;
  };
  if (
    !(global as CacheControlGlobal)[EMULATORS_STARTED] &&
    emulatorEnabled &&
    getApps().length > 0 &&
    firestore !== null
  ) {
    (global as CacheControlGlobal)[EMULATORS_STARTED] = true;
    // TODO: use computer's local Wi-Fi IP instead of localhost to test Firebase on LAN devices
    connectFirestoreEmulator(firestore, '10.88.111.5', 8080);
    connectAuthEmulator(authentication, 'http://10.88.111.5:9099');
  }
} catch (e) {
  console.log(e);
}

export { firestore, authentication /* functions */ };
