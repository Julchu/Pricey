import { doc, DocumentReference, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, GroceryList, Ingredient, Unit } from '../lib/firebase/interfaces';
import {
  priceCalculator,
  filterNullableObject,
  priceConverter,
  unitConverter,
} from '../lib/textFormatters';
import { useAuth } from './useAuth';
import image from 'next/image';
import { GroceryFormData } from '../components/GroceryLists';

type GroceryListMethods = {
  submitGroceryList: (
    groceryListData: GroceryFormData,
  ) => Promise<DocumentReference<GroceryList> | undefined>;

  updateGroceryList: (
    groceryListData: GroceryFormData,
  ) => Promise<DocumentReference<GroceryList> | undefined>;
};

const useGroceryList = (): [GroceryListMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { authUser } = useAuth();

  const submitGroceryList = useCallback<GroceryListMethods['submitGroceryList']>(
    async ({ name, ingredients, userId, viewable = false }) => {
      if (authUser?.documentId != userId) return;
      setLoading(true);

      // const previewPrice = priceCalculator(price, measurement);

      // const convertedUnit = unitConverter(unit, { mass: Unit.kilogram, volume: Unit.litre });
      // const convertedPreviewPrice = priceConverter(priceCalculator(previewPrice, quantity), unit, {
      //   mass: Unit.kilogram,
      //   volume: Unit.litre,
      // }).toFixed(2);

      // const trimmedName = name.trim().toLocaleLowerCase('en-US');

      // Creating doc with auto-generated id
      const groceryListDocRef = doc(db.groceryListCollection);

      // Ensuring all fields are passed by typechecking Ingredient
      // const newIngredient: Ingredient = {
      //   name: trimmedName,
      //   price: parseFloat(convertedPreviewPrice),
      //   unit: convertedUnit,
      //   userId: authUser.uid,
      //   createdAt: serverTimestamp(),
      //   image,
      // };

      try {
        /* If you want to auto generate an ID, use addDoc() + collection()
         * If you want to manually set the ID, use setDoc() + doc()
         */
        // await setDoc(groceryListDocRef, newIngredient);
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return groceryListDocRef;
    },
    [authUser],
  );

  const updateGroceryList = useCallback<GroceryListMethods['updateGroceryList']>(
    async ({ groceryListId, name, ingredients, userId, viewable }) => {
      if (authUser?.documentId != userId) return;
      // const previewPrice = priceCalculator(price, measurement);
      // const convertedPreviewPrice = priceConverter(priceCalculator(previewPrice, quantity), unit, {
      //   mass: Unit.kilogram,
      //   volume: Unit.litre,
      // }).toFixed(2);

      const groceryListDocRef = doc(db.groceryListCollection, groceryListId);

      // const updatedIngredient = filterNullableObject({
      //   ingredientId,
      //   price: parseFloat(convertedPreviewPrice),
      //   measurement,
      //   quantity,
      //   unit,
      //   location,
      //   image,
      // });

      try {
        // await updateDoc(groceryListDocRef, updatedIngredient);
      } catch (e) {
        setError(e as Error);
      }

      return groceryListDocRef;
    },
    [],
  );

  return [{ submitGroceryList, updateGroceryList }, loading, error];
};

export default useGroceryList;

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
