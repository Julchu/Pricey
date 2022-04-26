import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { IngredientFormData } from '../components/Home';
import { db } from '../lib/firebase';
import {
  Ingredient,
  IngredientInfo,
  ingredientInfoConverter,
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

      // Ex: /ingredientNames/a/almond: { info }
      const ingredientDocumentRef = doc(db, 'ingredientInfo', trimmedName[0]).withConverter(
        ingredientInfoConverter,
      );

      // Ensuring all fields are passed by typechecking Ingredient
      const newIngredient: Ingredient = {
        name,
        price: price * 100,
        unit,
        location,
        createdAt: serverTimestamp(),
      };

      /* If you want to auto generate an ID, use addDoc() + collection()
       * If you want to manually set the ID, use setDoc() + doc()
       */
      try {
        // /ingredients collection
        const docRef = await addDoc(ingredientsCollectionRef, newIngredient);

        // Getting current summary to compare lowest
        const currentIngredientInfo = await getDoc(
          doc(db, trimmedName, trimmedName[0]).withConverter(ingredientInfoConverter),
        ).then(doc => doc.data());

        const ingredientInfo: IngredientInfo = {
          ids: arrayUnion(docRef.id),
          count: increment(1),
          total: increment(price * 100),
          lowest:
            !currentIngredientInfo?.lowest || price < currentIngredientInfo?.lowest
              ? price * 100
              : undefined,
        };

        // /ingredientNames collection
        await setDoc(
          ingredientDocumentRef,
          {
            // Setting key as ingredient name, value as the ingredient's name
            [`${trimmedName}`]: ingredientInfo,
          },
          { merge: true },
        );
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return ingredientsCollectionRef as CollectionReference<Ingredient>;
    },
    [],
  );

  return [{ createIngredient }, loading, error];
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
