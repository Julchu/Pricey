import {
  doc,
  DocumentReference,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { IngredientFormData } from '../components/Home';
import { db } from '../lib/firebase';
import { Ingredient } from '../lib/firebase/interfaces';

// Firestore data converter
const ingredientConverter = {
  toFirestore: ({ name, price, unit, location }: Ingredient) => {
    return {
      name,
      price,
      unit,
      location,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return data.name, data.price, data.unit, data.location;
  },
};

type CreateIngredientMethods = {
  createIngredient: (ingredientData: IngredientFormData) => Promise<DocumentReference<Ingredient>>;
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
    }: IngredientFormData): Promise<DocumentReference<Ingredient>> => {
      setLoading(true);
      name = name.trim().toLocaleLowerCase('en-US');

      const ingredientDocumentRef = doc(db, 'ingredients', name).withConverter(ingredientConverter);

      /* Setting (adding): create or overwrite a single document (with optionally-manually-named document IDs)
       * setDoc(collection requires even-numbered path)
       * Ex: db, collection: <collectionName>, <documentName>
       */
      try {
        await setDoc(ingredientDocumentRef, {
          name,
          price,
          unit,
          location,
        });
      } catch (e) {
        setError(e as Error);
      }

      /* Add: auto-generate doc and give it ID automatically
       * addDoc(collection requires odd-numbered path)
       * Ex: db, collection: <collectionName>; becomes collectionName/0tG4ooMGjsdiyMfbjP3x
       * Ex: db, collection: <collectionName>, <documentName>, <subCollectionName>; collectionName/0tG4ooMGjsdiyMfbjP3x/strawberry
       */

      /* const ingredientsCollectionRef = collection(db, 'ingredients').withConverter(
        ingredientConverter,
      );

      try {
        const docRef = await addDoc(ingredientsCollectionRef, {
          name,
          price,
          unit,
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        setError(e as Error);
      } */

      return ingredientDocumentRef;
    },
    [],
  );

  return [{ createIngredient }, loading, error];
};

export default useCreateIngredient;
