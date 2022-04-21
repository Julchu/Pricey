import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const setUsers = async (): Promise<void> => {
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

export const getUsers = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
};

const deleteUser = async (collectionName: string, docName: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docName));
};

export const deleteUsers = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach(async doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    await deleteUser(collectionName, doc.id);
  });
};
