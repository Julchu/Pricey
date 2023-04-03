import { limit, onSnapshot, or, query, queryEqual, where } from 'firebase/firestore';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db, Ingredient, Unit } from '../../lib/firebase/interfaces';
import { Box, Grid, GridItem, Spinner } from '@chakra-ui/react';
import useIngredient from '../../hooks/useIngredient';
import { IngredientCard, NewIngredientCard } from '../IngredientCards';
import IngredientForm from '../IngredientForm';
import { useAuth } from '../../hooks/useAuth';
import { useDebouncedState } from '../../hooks/useDebouncedState';
// import Commodities from '../../';

import Fuse from 'fuse.js';

export type SubmissionFormData = {
  plu: string;
  price: number;
  quantity: number;
  unit: Unit;
  submitter: string;
  location?: string;
};

const defaultFormValues = (): Partial<SubmissionFormData> => ({
  // Add fields that are required for object submitted to Firebase as empty strings
  plu: '',
  submitter: '',
  location: '',
});

const IngredientList: FC = () => {
  const { authUser } = useAuth();

  // IngredientForm submission
  const methods = useForm<SubmissionFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  const [newIngredient, setNewIngredient] = useState<SubmissionFormData>({
    plu: '',
    price: NaN,
    quantity: NaN,
    unit: '' as Unit,
    submitter: authUser ? authUser.uid : '',
    // location
  });

  /* Manual ingredient search
   * searchIngredient: user input into search box; not used for query
   * debouncedIngredient: debounced searchIngredient; used for actual query
   * previousSearch: previous search to determine if re-query is needed
   * * if previous search/query includes new search, no need to re-query
   * searchResultsObj: holds array of streamed results
   * * Set as 4 fields of result arrays
   * * Individually filtered for duplicates
   * * Cannot combine due to syncing streaming issues
   * searchResultsArr: flattened searchResultsObj into single <Ingredient> array
   * * Used to filter with fuse.js
   */
  const [searchIngredient, setSearchIngredient] = useState<string>('');
  const debouncedIngredient = useDebouncedState(searchIngredient, 500);
  const [previousSearch, setPreviousSearch] = useState<string>('');
  const [searchResultsObj, setSearchResultsObj] = useState<{
    plu: Ingredient[];
    category: Ingredient[];
    commodity: Ingredient[];
    variety: Ingredient[];
  }>({
    plu: [],
    category: [],
    commodity: [],
    variety: [],
  });

  const [searchResultsArr, setSearchResultsArr] = useState<Ingredient[]>([]);
  const [foundIngredient, setFoundIngredient] = useState<boolean>(false);

  const [{ csvToIngredient }, csvData, _loading, _error] = useIngredient();

  useEffect(() => {
    csvToIngredient();
  }, [csvToIngredient]);

  // csvData
  // // Simplified fuzzy search with Fuse.js
  const filteredResults = useMemo(() => {
    const fuse = new Fuse(csvData, {
      keys: ['plu', 'category', 'commodity', 'variety', 'size'],
    });
    const results = fuse.search(searchIngredient);
    setFoundIngredient(results.length == 1);
    return results;
  }, [csvData, searchIngredient]);

  const onSubmit = useCallback(
    async (data: SubmissionFormData): Promise<void> => {
      // await submitIngredient(data);
      console.log(data);
    },
    [
      /* submitIngredient */
    ],
  );

  /* One day, text search can be simply done with Firestore
   * Currently, good solutions require backend 3rd party library (ElasticSearch, Algolia, Typesense)
   * https://cloud.google.com/firestore/docs/solutions/search
   * For now, really memory-inefficient client-sided method requires multiple queries and combining and filtering duplicates
   */
  // useEffect(() => {
  //   /* Detect if new search includes old search term
  //    * Ex: "bananana".includes('banana');
  //    */
  //   if (debouncedIngredient && (!debouncedIngredient.includes(previousSearch) || !previousSearch)) {
  //     setPreviousSearch(debouncedIngredient);
  //     const searchFields = ['plu', 'category', 'commodity', 'variety'];

  //     searchFields.forEach(searchField => {
  //       const ingredientInfoList: Ingredient[] = [];
  //       const existingPLU = new Set<string>([]);

  //       const q = query(
  //         db.ingredientCollection,
  //         where(searchField, '>=', debouncedIngredient),
  //         limit(30),
  //       );

  //       onSnapshot(q, querySnapshot => {
  //         querySnapshot.forEach(doc => {
  //           const currentPLU = doc.data().plu;
  //           if (!existingPLU.has(currentPLU)) {
  //             existingPLU.add(currentPLU);
  //             ingredientInfoList.push(doc.data());
  //           }
  //         });

  //         /* Need to cast searchField as keyof Ingredient to type it an Ingredient's field
  //          * Need to cast the result as string since some Ingredient fields aren't strings
  //          */
  //         const filtered = ingredientInfoList.filter(ingredient =>
  //           (ingredient[searchField as keyof Ingredient] as string)?.includes(debouncedIngredient),
  //         );

  //         setSearchResultsObj(previousSearch => ({
  //           ...previousSearch,
  //           [searchField]: filtered,
  //         }));
  //       });
  //     });
  //   }
  // }, [debouncedIngredient, previousSearch]);

  // const removeDuplicateIngredients = (originalArray: Ingredient[]): Ingredient[] => {
  //   const existingIngredient = new Set<string>([]);
  //   return originalArray.filter(ingredient => {
  //     if (!existingIngredient.has(ingredient.plu)) {
  //       existingIngredient.add(ingredient.plu);
  //       return ingredient;
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (searchResultsObj) {
  //     const flatSearch = [
  //       ...searchResultsObj.plu,
  //       ...searchResultsObj.category,
  //       ...searchResultsObj.commodity,
  //       ...searchResultsObj.variety,
  //     ];

  //     setSearchResultsArr(removeDuplicateIngredients(flatSearch));
  //   }
  // }, [searchResultsObj]);

  /* Live-updating retrieval of specific document and its contents */
  // useEffect(() => {
  //   const q = query(db.ingredientCollection, where('count', '>=', 0) /*limit(8)*/);

  //   onSnapshot(q, querySnapshot => {
  //     const ingredientInfoList: Ingredient[] = [];
  //     querySnapshot.forEach(doc => {
  //       ingredientInfoList.push(doc.data());
  //     });
  //     setSearchResults(ingredientInfoList);
  //   });

  //   const first = query(collection(db, 'cities'), orderBy('population'), limit(25));
  //   const documentSnapshots = await getDocs(first);

  //   // Get the last visible document
  //   const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //   console.log('last', lastVisible);

  //   // Construct a new query starting at this document,
  //   // get the next 25 cities.
  //   const next = query(
  //     collection(db, 'cities'),
  //     orderBy('population'),
  //     startAfter(lastVisible),
  //     limit(25),
  //   );
  // }, []);

  // const filteredResults = useMemo(() => {
  //   setFoundIngredient(searchResults.some(({ variety }) => newIngredient.variety === variety));
  //   return searchResults
  //     .filter(ingredientInfo => ingredientInfo?.variety.includes(newIngredient.variety || ''))
  //     .sort();
  // }, [searchResults, newIngredient.variety]);

  // if (!authUser) return;

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <IngredientForm
            searchIngredient={searchIngredient}
            setSearchIngredient={setSearchIngredient}
            newIngredient={newIngredient}
            setNewIngredient={setNewIngredient}
          />

          {/* Line separating header form and cards */}
          <Box my={'20px'} borderTop={'1px solid lightgrey'} boxShadow={'focus'} />

          <Grid
            mx={{ base: 'unset', sm: '30px' }}
            gridAutoFlow={{ base: 'column', sm: 'row' }}
            rowGap={'30px'}
            columnGap={{ base: '100%', sm: '30px' }}
            overflowX={{ base: 'scroll', sm: 'visible' }}
            overflowY={{ base: 'hidden', sm: 'visible' }}
            scrollSnapType={['x mandatory', 'none']}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 150px)',
              sm: 'repeat(auto-fill, 250px)',
            }}
          >
            {/* {!foundIngredient ? (
              <GridItem>
                <NewIngredientCard
                  handleSubmit={handleSubmit(onSubmit)}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                />
              </GridItem>
            ) : null} */}

            {/* {filteredResults?.map(({ item }, index) => {
              return (
                <GridItem
                  ml={{ base: foundIngredient ? '30px' : '', sm: 'unset' }}
                  mr={{ base: index === filteredResults.length - 1 ? '30px' : '', sm: 'unset' }}
                  key={`${item.variety}_${index}`}
                >
                  <IngredientCard
                    ingredientInfo={item}
                    handleSubmit={handleSubmit(onSubmit)}
                    newIngredient={newIngredient}
                    setNewIngredient={setNewIngredient}
                  />
                </GridItem>
              );
            })} */}
          </Grid>
        </>
      </FormProvider>
    </form>
  );
};

export default IngredientList;

// // Template onSubmit callback from TheFoodWorks
// const onSubmit = useCallback(
//   async (data: RecipeFormData, cb): Promise<void> => {
//     const ref = await updateRecipe(data);
//     cb ? cb(ref) : router.push('/recipes');
//   },
//   [updateRecipe, router],
// );

// const onDelete = useCallback(async (): Promise<void> => {
//   await remove();
//   router.push('/recipes');
// }, [remove, router]);
