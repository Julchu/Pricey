import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '.';
import { db, IngredientInfo } from './interfaces';

// Retrieves list of documents
export const getDocuments = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  querySnapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
};

// Retrieves list of ingredient names
export const getIngredientNames = async (
  collectionName: string,
  documentId: string,
  callback: (arg0: IngredientInfo) => void,
): Promise<void> => {
  const snap = await getDoc(
    // Retrieve single document with known id
    db.ingredientInfoDoc(documentId),
  );
  if (snap.exists()) {
    callback(snap.data());
  }
};

const deleteDocument = async (collectionName: string, docName: string): Promise<void> => {
  await deleteDoc(doc(firestore, collectionName, docName));
};

export const deleteCollection = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    deleteDocument(collectionName, doc.id);
  });
};

/*

const storageRef = ref(storage, 'some-child');

// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then(snapshot => {
  console.log('Uploaded a blob or file!');
});
*/
