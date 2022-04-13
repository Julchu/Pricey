// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  DocumentData,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const firebaseConfig = publicRuntimeConfig.firebaseConfig;
const app = initializeApp(firebaseConfig);
// app.firestore().useEmulator('localhost', 5003);

// const analytics = getAnalytics(app);
const db = getFirestore(app);

if (firebaseConfig.emulatorEnabled) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

const testSetFirebase1 = async (): Promise<DocumentData[]> => {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
};

const testSetFirebase = async (): Promise<void> => {
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

const testViewfirebase = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};

export { testSetFirebase1, testSetFirebase, testViewfirebase };
