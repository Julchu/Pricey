import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '.';
import { converter, IngredientInfo } from './interfaces'; // Retrieves list of documents

// Retrieves list of documents
export const getDocuments = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
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
    doc(db, collectionName, documentId).withConverter(converter<IngredientInfo>()),
  );
  if (snap.exists()) {
    callback(snap.data());
  }
};

const deleteDocument = async (collectionName: string, docName: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, docName));
};

export const deleteCollection = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach(async doc => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    await deleteDocument(collectionName, doc.id);
  });
};
