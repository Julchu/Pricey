import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { IngredientFormData } from '../components/Home';
import { db } from '../lib/firebase';
import {
  Ingredient,
  IngredientName,
  ingredientNameConverter,
  ingredientsConverter,
} from '../lib/firebase/interfaces';

type CreateIngredientMethods = {
  createIngredient: (
    ingredientData: IngredientFormData,
  ) => Promise<CollectionReference<Ingredient>>;
};

const useCreateIngredient = (): [CreateIngredientMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const createIngredient = useCallback<CreateIngredientMethods['createIngredient']>(
    async ({
      name,
      price,
      unit,
      location,
    }: IngredientFormData): Promise<CollectionReference<Ingredient>> => {
      setLoading(true);

      const trimmedName = name.trim().toLocaleLowerCase('en-US');

      const ingredientsCollectionRef = collection(db, 'ingredients').withConverter(
        ingredientsConverter,
      );

      // Ex: /ingredientNames/a/almond: { id: id used in /ingredients for almond }
      const ingredientDocumentRef = doc(db, 'ingredientNames', trimmedName[0]).withConverter(
        ingredientNameConverter,
      );

      // Ensuring all fields are passed
      const newIngredient: Ingredient = {
        name,
        price,
        unit,
        location,
        createdAt: Timestamp.now(),
      };

      /* If you want to auto generate an ID, use addDoc() + collection()
       * If you want to manually set the ID, use setDoc() + doc()
       */
      try {
        // /ingredients collection
        const docRef = await addDoc(ingredientsCollectionRef, newIngredient);

        const ingredientName: IngredientName = { ids: arrayUnion(docRef.id) };

        // /ingredientNames collection
        await setDoc(
          ingredientDocumentRef,
          {
            // Setting key as ingredient name, value as the ingredient's name
            [`${trimmedName}`]: ingredientName,
          },
          { merge: true },
        );
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return ingredientsCollectionRef;
    },
    [],
  );

  return [{ createIngredient }, loading, error];
};

export const getDocuments = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
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

export default useCreateIngredient;

// Examples
/* If you want to auto generate an ID, use addDoc() + collection()
 * If you want to manually set the ID, use setDoc() + doc()
 */

/* Add: auto-generate doc and give it ID automatically
 * addDoc(collection requires odd-numbered path)
 * Ex: db, collection: <collectionName>; becomes collectionName/0tG4ooMGjsdiyMfbjP3x
 * Ex: db, collection: <collectionName>, <documentName>, <subCollectionName>; collectionName/0tG4ooMGjsdiyMfbjP3x/strawberry
 */

/* const ingredientsCollectionRef = collection(db, 'ingredients').withConverter(ingredientsConverter);
try {
  const docRef = await addDoc(ingredientsCollectionRef, {
    name,
    price,
    unit,
    location,
  });
  console.log('Document written with ID: ', docRef.id);
} catch (e) {
  setError(e as Error);
}

return ingredientsCollectionRef; */

/* Setting (adding): create or overwrite a single document with manually-named document IDs
 * setDoc(collection requires even-numbered path)
 * Ex: db, collection: <collectionName>, <documentName>
 */

/* const ingredientDocumentRef = doc(db, 'ingredients').withConverter(ingredientsConverter);
try {
  await setDoc(ingredientDocumentRef, {
    name: name.trim().toLocaleLowerCase('en-US'),
    price,
    unit,
    location,
  });
} catch (e) {
  setError(e as Error);
}

return ingredientDocumentRef; */
