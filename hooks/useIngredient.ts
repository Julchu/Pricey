import {
  addDoc,
  arrayUnion,
  CollectionReference,
  doc,
  getDoc,
  increment,
  PartialWithFieldValue,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { SubmissionFormData } from '../components/Dashboard';
import { db, Submission, Ingredient, Unit } from '../lib/firebase/interfaces';
import { isLiquid, isMass, priceConverter } from '../lib/textFormatters';
import { useAuth } from './useAuth';
import { firestore } from '../lib/firebase';

type IngredientMethods = {
  csvToIngredient: () => void;
  csvToFirestore: () => void;
  submitIngredient: (ingredientData: SubmissionFormData) => void; //Promise<CollectionReference<Submission>>;

  updateIngredient: () => void;
  // updateIngredient: (
  //   ingredientData: IngredientFormData,
  // ) => Promise<CollectionReference<Ingredient>>;
};

const useIngredient = (): [
  IngredientMethods,
  Record<string, string>[],
  boolean,
  Error | undefined,
] => {
  const [csvData, setCSVData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { authUser } = useAuth();

  // Parses through CSV and /save every ingredient to Firestore
  const stepParser = useCallback((data: string) => {
    Papa.parse(data, {
      header: true,
      worker: true,
      // Streaming and modifying row by row
      step: async (row: { data: Record<string, string> }) => {
        const batch = writeBatch(firestore);

        const { PLU, CATEGORY, COMMODITY, VARIETY, IMAGE, SIZE, ..._rest } = row.data;
        const ingredientDocRef = doc(db.ingredientCollection, PLU);

        const ingredientInfo = {
          plu: PLU.trim(),
          category: CATEGORY ? CATEGORY.trim().toLocaleLowerCase() : '',
          commodity: COMMODITY ? COMMODITY.trim().toLocaleLowerCase() : '',
          variety: VARIETY ? VARIETY.trim().toLocaleLowerCase() : '',
          image: IMAGE ? IMAGE.trim().toLocaleLowerCase() : '',
          size: SIZE ? SIZE.trim().toLocaleLowerCase() : '',
          count: increment(0),
          lastUpdated: serverTimestamp(),
        };

        batch.set(ingredientDocRef, ingredientInfo as PartialWithFieldValue<Ingredient>);

        // Commit the batch
        await batch.commit();
      },

      complete: _ => {
        setLoading(false);
      },
    });
  }, []);

  const wholeParser = useCallback((data: string) => {
    Papa.parse(data, {
      header: true,
      worker: true,
      // Parsing the entire file at once
      complete: results => {
        const newResults = results.data.reduce<Record<string, string>[]>(
          (filteredData, nextValue) => {
            const { PLU, CATEGORY, COMMODITY, VARIETY, IMAGE, SIZE, ..._rest } =
              nextValue as Record<string, string>;

            const ingredientInfo = {
              plu: PLU.trim(),
              category: CATEGORY ? CATEGORY.trim().toLocaleLowerCase() : '',
              commodity: COMMODITY ? COMMODITY.trim().toLocaleLowerCase() : '',
              variety: VARIETY ? VARIETY.trim().toLocaleLowerCase() : '',
              image: IMAGE ? IMAGE.trim().toLocaleLowerCase() : '',
              size: SIZE ? SIZE.trim().toLocaleLowerCase() : '',
            };

            filteredData.push(ingredientInfo);
            return filteredData;
          },
          [],
        );
        setCSVData(newResults as Record<string, string>[]);
        setLoading(false);
      },
    });
  }, []);

  const csvToIngredient = useCallback<IngredientMethods['csvToIngredient']>(async (): void => {
    setLoading(true);

    await fetch('/file.csv')
      .then(response => {
        return response.text();
      })
      .then(data => {
        wholeParser(data);
      });
  }, [wholeParser]);

  const csvToFirestore = useCallback<IngredientMethods['csvToFirestore']>(() => {
    setLoading(true);

    fetch('/file.csv')
      .then(response => {
        return response.text();
      })
      .then(data => {
        stepParser(data);
      });
  }, [stepParser]);

  const submitIngredient = useCallback<IngredientMethods['submitIngredient']>(
    async ({}: // variety,
    // price,
    // quantity,
    // unit,
    // location,
    SubmissionFormData) => {
      if (!authUser) return;
      setLoading(true);

      //     // Get a new write batch
      //     const batch = writeBatch(firestore);

      //     // price = priceConverter((price * 100) / quantity, unit, {
      //     //   mass: Unit.pound,
      //     //   liquid: Unit.quart,
      //     // });

      //     // unit = isMass(unit)
      //     //   ? Unit.pound
      //     //   : isLiquid(unit)
      //     //   ? Unit.litre
      //     //   : unit in Unit
      //     //   ? unit
      //     //   : Unit.unit;

      //     // const trimmedName = variety.trim().toLocaleLowerCase('en-US');

      //     // const submissionDocRef = doc(db.submissionCollection);

      //     // Ex: /ingredientInfo/almond: { info }
      //     // const submissionDocumentRef = db.ingredientDoc(trimmedName);

      //     // Ensuring all fields are passed by typechecking Ingredient
      //     // const newSubmission: Submission = {
      //     //   // name,
      //     //   price,
      //     //   // location,
      //     //   unit,
      //     //   createdAt: serverTimestamp(),
      //     // };

      //     /* If you want to auto generate an ID, use addDoc() + collection()
      //      * If you want to manually set the ID, use setDoc() + doc()
      //      */
      //     try {
      //       // /ingredients collection
      //       // const docRef = await addDoc(submissionCollectionRef, newSubmission);
      //       // Getting current summary to compare lowest
      //       // const existingIngredient = await getDoc(ingredientDocumentRef).then(doc => doc.data());
      //       // await getDocs(query(db.ingredientCollection, where('plu', '==', uid)));
      //       /* If lowest exists:
      //        * * If lowest > price: price
      //        * * Else: lowest
      //        * Else price
      //        */
      //       // const lowest = currentIngredientInfo?.lowest
      //       //   ? currentIngredientInfo?.lowest > price
      //       //     ? price
      //       //     : currentIngredientInfo?.lowest
      //       //   : price;
      //       // Prevent overriding existing ingredient unit
      //       // const existingUnit = !currentIngredientInfo?.unit ? unit : undefined;
      //       // Update existing ingredient
      //       // const submissionInfo: Ingredient = {
      //       //   name: 'cheese',
      //       // submissions: arrayUnion(docRef.id),
      //       // count: increment(1),
      //       // total: increment(price),
      //       // lowest,
      //       // unit: existingUnit,
      //       //   ingredientId: '',
      //       //   image: '',
      //       //   price: 0,
      //       //   unit: Unit.pound,
      //       //   submitter: authUser,
      //       //   createdAt: serverTimestamp(),
      //       // };
      //       // Use setDoc instead of updateDoc because update will not create new docs (if previously nonexistent)
      //       // await setDoc(submissionDocumentRef, submissionInfo, { merge: true });
      //     } catch (e) {
      //       setError(e as Error);
      //     }

      //     setLoading(false);
      //     return submissionCollectionRef as CollectionReference<Submission>;
    },
    [authUser],
  );

  const updateIngredient = useCallback<IngredientMethods['updateIngredient']>(() => {}, []);

  return [
    { csvToIngredient, csvToFirestore, submitIngredient, updateIngredient },
    csvData,
    loading,
    error,
  ];
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
