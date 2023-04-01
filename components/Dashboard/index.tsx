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
  price: 0,
  submitter: '',
  location: '',
  unit: undefined,
});

const IngredientList: FC = () => {
  const { authUser } = useAuth();
  // const [{ submitIngredient }, _loading, _error] = useIngredient();

  const onSubmit = useCallback(
    async (data: SubmissionFormData): Promise<void> => {
      // await submitIngredient(data);
      console.log(data);
    },
    [
      /* submitIngredient */
    ],
  );

  // React Hook Form
  const methods = useForm<SubmissionFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  /* Manual ingredient search
   * searchInput: is used for filtering search results after query
   * searchResults holds array of streamed results
   */
  const [newIngredient, setNewIngredient] = useState<SubmissionFormData>({
    plu: '',
    price: NaN,
    quantity: NaN,
    unit: '' as Unit,
    submitter: authUser ? authUser.uid : '',
    // location
  });

  const [searchIngredient, setSearchIngredient] = useState<string>('');
  const debouncedIngredient = useDebouncedState(searchIngredient, 1000);
  const previousSearch = useRef<string>('');
  const [foundIngredient, setFoundIngredient] = useState<boolean>(false);

  useEffect(() => {
    previousSearch.current = debouncedIngredient;
  }, [debouncedIngredient]);

  const [searchResults, setSearchResults] = useState<Record<string, Ingredient[]>>({
    plu: [],
    category: [],
    commodity: [],
    variety: [],
  });

  // Simplified fuzzy search
  useEffect(() => {
    /* TODO: detect if new search includes old search term
     * console.log("bananana".includes('banana'));
     */
    console.log('current:', debouncedIngredient, 'previous:', previousValue.current);
    if (!debouncedIngredient.includes(previousSearch.current)) {
      const searchFields = ['plu', 'category', 'commodity', 'variety'];

      searchFields.forEach(searchField => {
        const ingredientInfoList: Ingredient[] = [];
        const existingPLU = new Set<string>([]);
        const q = query(
          db.ingredientCollection,
          where(searchField, '>=', debouncedIngredient),
          limit(30),
        );

        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            const currentPLU = doc.data().plu;
            if (!existingPLU.has(currentPLU)) {
              existingPLU.add(currentPLU);
              ingredientInfoList.push(doc.data());
            }
          });

          const filtered = ingredientInfoList.filter(ingredient =>
            (ingredient[searchField as keyof Ingredient] as string)?.includes(debouncedIngredient),
          );

          setSearchResults(previousSearch => ({
            ...previousSearch,
            [searchField]: filtered,
          }));
        });
      });
    }
  }, [debouncedIngredient]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  // useEffect(() => {
  //   if (debouncedIngredient.trim()) {
  //     searchIngredient(debouncedIngredient.trim(), true).then(data => {
  //       setPropositions(
  //         data?.map(item => ({
  //           label: `${item.name}\t(${item.category})${
  //             item.brandOwner ? `  |  ` + item.brandOwner : ''
  //           }`,
  //           ingredient: item,
  //         })) || [],
  //       );
  //     });
  //   }
  // }, [debouncedIngredient, searchIngredient]);

  /* One day, text search can be simply done with Firestore
   * Currently, good solutions require backend 3rd party library (ElasticSearch, Algolia, Typesense)
   * https://cloud.google.com/firestore/docs/solutions/search
   * For now, really memory-inefficient client-sided method requires multiple queries and combining and filtering duplicates
   */

  /* const [ingredient, setIngredient] = useState('');
  useEffect(() => {
      if (debouncedIngredient.trim()) {
        searchIngredient(debouncedIngredient.trim(), true).then(data => {
          setPropositions(
            data?.map(item => ({
              label: `${item.name}\t(${item.category})${
                item.brandOwner ? `  |  ` + item.brandOwner : ''
              }`,
              ingredient: item,
            })) || [],
          );
        });
      }
    }, [debouncedIngredient, searchIngredient]); */

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

          {/* <Grid
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
            {!foundIngredient ? (
              <GridItem>
                <NewIngredientCard
                  handleSubmit={handleSubmit(onSubmit)}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                />
              </GridItem>
            ) : null}

            {filteredResults?.map((ingredientInfo, index) => {
              return (
                <GridItem
                  ml={{ base: foundIngredient ? '30px' : '', sm: 'unset' }}
                  mr={{ base: index === filteredResults.length - 1 ? '30px' : '', sm: 'unset' }}
                  key={`${ingredientInfo.variety}_${index}`}
                >
                  <IngredientCard
                    ingredientInfo={ingredientInfo}
                    handleSubmit={handleSubmit(onSubmit)}
                    newIngredient={newIngredient}
                    setNewIngredient={setNewIngredient}
                  />
                </GridItem>
              );
            })}
          </Grid> */}
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
