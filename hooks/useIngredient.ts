import { doc, DocumentReference, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, Ingredient, Unit } from '../lib/firebase/interfaces';
import {
  priceCalculator,
  filterNullableObject,
  priceConverter,
  unitConverter,
} from '../lib/textFormatters';
import { useAuth } from './useAuth';
import { IngredientFormData } from '../components/Dashboard';

type IngredientMethods = {
  submitIngredient: (
    ingredientData: IngredientFormData,
  ) => Promise<DocumentReference<Ingredient> | undefined>;

  updateIngredient: (
    ingredientData: IngredientFormData,
  ) => Promise<DocumentReference<Ingredient> | undefined>;
};

const useIngredient = (): [IngredientMethods, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { authUser } = useAuth();

  const submitIngredient = useCallback<IngredientMethods['submitIngredient']>(
    async ({ name, price, measurement, quantity, unit, image }) => {
      if (!authUser) return;
      setLoading(true);

      const cost = dinero({ amount: 50, currency: CAD });
      const cost2 = dinero({ amount: 530, currency: CAD });

      const aaaa = multiply(cost, {
        amount: toSnapshot(cost2).amount,
        scale: toSnapshot(cost2).scale,
      });

      const [divisor, scale] = getScale(0.3555559587928739487293874928374987239487234);

      // console.log(decimalToFraction(measurement));
      console.log(divisor, scale);

      // const costPerUnit = multiply(cost, {
      //   amount: getScale(1 / measurement)[0],
      //   scale,
      // });

      // console.log(toSnapshot(d1));

      const previewPrice = 0; //priceCalculator(price, measurement);
      /* Price example: $6.97 for box of 12 x 0.355L cans of Coke
       * Price: 6.97
       * Measurement: 0.355
       * Unit: L
       * Quantity: 12
       * Price per measurement: 6.97 / 0.355
       * Price per quantity: 6.97 / 12
       * Price per measurement per quantity: 6.97 / 0.355 / 12
       * ---
       * Price example: $7.50 for deal of 2 x 1.89L cartons of almond milk
       * Price per measurement:
       */
      // const pricePerAmount;

      const convertedUnit = unitConverter(unit, { mass: Unit.kilogram, volume: Unit.litre });
      const convertedPreviewPrice = priceConverter(
        0 /* priceCalculator(previewPrice, quantity) */,
        unit,
        {
          mass: Unit.kilogram,
          volume: Unit.litre,
        },
      ).toPrecision(2);

      const trimmedName = name.trim().toLocaleLowerCase('en-US');

      // Creating doc with auto-generated id
      const ingredientDocRef = doc(db.ingredientCollection);

      // Ensuring all fields are passed by typechecking Ingredient
      const newIngredient: Ingredient = {
        name: trimmedName,
        price: parseFloat(convertedPreviewPrice),
        unit: convertedUnit,
        userId: authUser.uid,
        createdAt: serverTimestamp(),
        image,
      };

      try {
        /* If you want to auto generate an ID, use addDoc() + collection()
         * If you want to manually set the ID, use setDoc() + doc()
         */
        // await setDoc(ingredientDocRef, newIngredient);
      } catch (e) {
        setError(e as Error);
      }

      setLoading(false);
      return ingredientDocRef;
    },
    [authUser],
  );

  const updateIngredient = useCallback<IngredientMethods['updateIngredient']>(
    async ({ ingredientId, price, measurement, quantity, unit, location, image }) => {
      const previewPrice = priceCalculator(price, measurement);
      const convertedPreviewPrice = priceConverter(priceCalculator(previewPrice, quantity), unit, {
        mass: Unit.kilogram,
        volume: Unit.litre,
      }).toPrecision(2);

      const ingredientDocRef = doc(db.ingredientCollection, ingredientId);

      const updatedIngredient = filterNullableObject({
        ingredientId,
        price: parseFloat(convertedPreviewPrice),
        measurement,
        quantity,
        unit,
        location,
        image,
      });

      try {
        await updateDoc(ingredientDocRef, updatedIngredient);
      } catch (e) {
        setError(e as Error);
      }

      return ingredientDocRef;
    },
    [],
  );

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
