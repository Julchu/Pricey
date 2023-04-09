import {
  addDoc,
  arrayUnion,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  PartialWithFieldValue,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, Ingredient, Unit } from '../lib/firebase/interfaces';
import { isVolume, isMass, priceConverter } from '../lib/textFormatters';
import { useAuth } from './useAuth';
import { firestore } from '../lib/firebase';
import { IngredientFormData } from '../components/Dashboard';

type IngredientMethods = {
  submitIngredient: (
    ingredientData: IngredientFormData,
  ) => Promise<DocumentReference<Ingredient> | undefined>; //Promise<CollectionReference<Submission>>;

  updateIngredient: () => void;
  // updateIngredient: (
  //   ingredientData: IngredientFormData,
  // ) => Promise<CollectionReference<Ingredient>>;
};

const useIngredient = (): [IngredientMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { authUser } = useAuth();

  const submitIngredient = useCallback<IngredientMethods['submitIngredient']>(
    async ({ name, price, quantity, unit, location, image }) => {
      if (!authUser) return;
      setLoading(true);

      price = priceConverter((price * 100) / quantity, unit, {
        mass: Unit.pound,
        liquid: Unit.quart,
      });

      unit = isMass(unit)
        ? Unit.pound
        : isVolume(unit)
        ? Unit.litre
        : unit in Unit
        ? unit
        : Unit.unit;

      const trimmedName = name.trim().toLocaleLowerCase('en-US');

      // Ex: /ingredientInfo/almond: { info }
      const ingredientDocRef = doc(db.ingredientCollection);

      // Ensuring all fields are passed by typechecking Ingredient
      const newIngredient: Ingredient = {
        name: trimmedName,
        price,
        unit,
        userId: authUser.uid,
        createdAt: serverTimestamp(),
      };

      try {
        /* If you want to auto generate an ID, use addDoc() + collection()
         * If you want to manually set the ID, use setDoc() + doc()
         */
        await setDoc(ingredientDocRef, newIngredient);
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return ingredientDocRef;
    },
    [authUser],
  );

  const updateIngredient = useCallback<IngredientMethods['updateIngredient']>(() => {
    // // ingredients collection
    // const docRef = await addDoc(ingredientCollectionRef, newIngredient);
    // // Getting current summary to compare lowest
    // const existingIngredient = await getDoc(ingredientDocumentRef).then(doc => doc.data());
    // await getDocs(query(db.ingredientCollection, where('plu', '==', uid)));
    // /* If lowest exists:
    //  * * If lowest > price: price
    //  * * Else: lowest
    //  * Else price
    //  */
    // const ingredientCollectionRef = doc(db.ingredientCollection);
    // const lowest = currentIngredientInfo?.lowest
    //   ? currentIngredientInfo?.lowest > price
    //     ? price
    //     : currentIngredientInfo?.lowest
    //   : price;
    // // Prevent overriding existing ingredient unit
    // const existingUnit = !currentIngredientInfo?.unit ? unit : undefined;
    // Update existing ingredient
    // const ingredientInfo: Ingredient = {
    //   name: 'cheese',
    //   submissions: arrayUnion(docRef.id),
    //   count: increment(1),
    //   total: increment(price),
    //   lowest,
    //   unit: existingUnit,
    //   ingredientId: '',
    //   image: '',
    //   price: 0,
    //   unit: Unit.pound,
    //   submitter: authUser,
    //   createdAt: serverTimestamp(),
    // };
    /* Use setDoc instead of updateDoc because update will not create new docs (if previously nonexistent) */
  }, []);

  return [{ submitIngredient, updateIngredient }, loading, error];
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
