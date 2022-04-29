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
import { converter, Ingredient, IngredientInfo } from '../lib/firebase/interfaces';

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

      price *= 100;

      const trimmedName = name.trim().toLocaleLowerCase('en-US');

      const ingredientsCollectionRef = collection(db, 'ingredients').withConverter(
        converter<Ingredient>(),
      );

      // Ex: /ingredientInfo/almond: { info }
      const ingredientDocumentRef = await doc(db, 'ingredientInfo', trimmedName).withConverter(
        converter<IngredientInfo>(),
      );

      // Ensuring all fields are passed by typechecking Ingredient
      const newIngredient: Ingredient = {
        name,
        price,
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
        const currentIngredientInfo = await getDoc(ingredientDocumentRef).then(doc => doc.data());

        /* If lowest exists:
         ** If lowest > price: price
         ** Else: lowest
         * Else price
         */
        const lowest = currentIngredientInfo?.lowest
          ? currentIngredientInfo?.lowest > price
            ? price
            : currentIngredientInfo?.lowest
          : price;

        const ingredientInfo: IngredientInfo = {
          name: trimmedName,
          ids: arrayUnion(docRef.id),
          count: increment(1),
          total: increment(price),
          lowest,
        };

        // Use setDoc instead of updateDoc because update will not create new docs (if previously nonexistant)
        await setDoc(ingredientDocumentRef, ingredientInfo, { merge: true });
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

return ingredientDocumentRef;

// Setting key as ingredient name, value as the ingredient's name
await setDoc(
  ingredientDocumentRef,
  {
    [`${trimmedName}`]: ingredientInfo,
  },
  { merge: true },
);
*/
