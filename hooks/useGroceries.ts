import { doc, DocumentReference, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { GroceryListFormData } from '../components/GroceryLists/newList';
import { db, GroceryList } from '../lib/firebase/interfaces';
import { useAuth } from './useAuth';

type GroceryListMethods = {
  submitGroceryList: (
    groceryListData: GroceryListFormData,
  ) => Promise<DocumentReference<GroceryList> | undefined>;

  updateGroceryList: (
    groceryListData: GroceryListFormData,
  ) => Promise<DocumentReference<GroceryList> | undefined>;
};

const useGroceryList = (): [GroceryListMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { authUser } = useAuth();

  const submitGroceryList = useCallback<GroceryListMethods['submitGroceryList']>(
    async ({ name, ingredients, viewable = false }) => {
      if (!authUser) return;
      setLoading(true);

      // Creating doc with auto-generated id
      const groceryListDocRef = doc(db.groceryListCollection);

      // Ensuring all fields are passed by typechecking Ingredient
      const newList: GroceryList = {
        name: name.trim(),
        ingredients,
        viewable,
        userId: authUser.uid,
        createdAt: serverTimestamp(),
      };

      try {
        /* If you want to auto generate an ID, use addDoc() + collection()
         * If you want to manually set the ID, use setDoc() + doc()
         */
        await setDoc(groceryListDocRef, newList);
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return groceryListDocRef;
    },
    [authUser],
  );

  const updateGroceryList = useCallback<GroceryListMethods['updateGroceryList']>(
    async ({ groceryListId, name, ingredients, viewable }) => {
      if (!authUser) return;
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
    [authUser?.documentId],
  );

  return [{ submitGroceryList, updateGroceryList }, loading, error];
};

export default useGroceryList;
