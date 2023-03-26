import {
  addDoc,
  arrayUnion,
  CollectionReference,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { IngredientFormData } from '../components/Dashboard';
import { db, Submission, Ingredient, Unit } from '../lib/firebase/interfaces';
import { isArea, isMass, priceConverter } from '../lib/textFormatters';

type IngredientMethods = {
  createIngredient: (
    ingredientData: IngredientFormData,
  ) => Promise<CollectionReference<Submission>>;

  updateIngredient: () => void;
  // updateIngredient: (
  //   ingredientData: IngredientFormData,
  // ) => Promise<CollectionReference<Ingredient>>;
};

const useIngredient = (): [IngredientMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const createIngredient = useCallback<IngredientMethods['createIngredient']>(
    async ({
      name,
      price,
      quantity,
      unit,
      location,
    }: IngredientFormData): Promise<CollectionReference<Submission>> => {
      setLoading(true);

      price = priceConverter((price * 100) / quantity, unit, {
        mass: Unit.lb,
        area: Unit.squareFeet,
      });

      unit = isMass(unit)
        ? Unit.lb
        : isArea(unit)
        ? Unit.squareFeet
        : unit in Unit
        ? unit
        : Unit.unit;

      const trimmedName = name.trim().toLocaleLowerCase('en-US');

      const ingredientsCollectionRef = db.ingredientCollection;

      // Ex: /ingredientInfo/almond: { info }
      const ingredientDocumentRef = db.ingredientInfoDoc(trimmedName);

      // Ensuring all fields are passed by typechecking Ingredient
      const newIngredient: Submission = {
        name,
        price,
        location,
        unit,
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
         * * If lowest > price: price
         * * Else: lowest
         * Else price
         */
        const lowest = currentIngredientInfo?.lowest
          ? currentIngredientInfo?.lowest > price
            ? price
            : currentIngredientInfo?.lowest
          : price;

        // Prevent overriding existing ingredient unit
        const existingUnit = !currentIngredientInfo?.unit ? unit : undefined;

        const ingredientInfo: Ingredient = {
          name: trimmedName,
          submissions: arrayUnion(docRef.id),
          count: increment(1),
          total: increment(price),
          lowest,
          unit: existingUnit,
        };

        // Use setDoc instead of updateDoc because update will not create new docs (if previously nonexistent)
        await setDoc(ingredientDocumentRef, ingredientInfo, { merge: true });
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return ingredientsCollectionRef as CollectionReference<Submission>;
    },
    [],
  );

  const updateIngredient = useCallback<IngredientMethods['updateIngredient']>(() => {}, []);

  return [{ createIngredient, updateIngredient }, loading, error];
};

export default useIngredient;

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
