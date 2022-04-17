// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import {
  addDoc,
  collection,
  // connectFirestoreEmulator,`
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  initializeFirestore,
} from 'firebase/firestore';
import getConfig from 'next/config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const { publicRuntimeConfig } = getConfig();
const firebaseConfig = publicRuntimeConfig.firebaseConfig;
// const emulatorEnabled = firebaseConfig.emulatorEnabled;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

/* getFirestore returns existing Firestore or creates a new one with default settings
 * initializeFirestore creates a new one with optional settings
 */
// const db = getFirestore(app);
const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
// const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// if (emulatorEnabled) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

const setUsers = async (): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Alan',
      middle: 'Mathison',
      last: 'Turing',
      born: 1912,
    });

    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// const getUsers = async (): Promise<void> => {};

const getCities = async (): Promise<DocumentData[]> => {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
};

const getUsers = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
};

const deleteUser = async (collectionName: string, docName: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docName));
};

const deleteUsers = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach(async doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    await deleteUser(collectionName, doc.id);
  });
};

export { setUsers, getCities, getUsers, deleteUser, deleteUsers };
