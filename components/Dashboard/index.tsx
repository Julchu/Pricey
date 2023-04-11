import { limit, onSnapshot, query, where } from 'firebase/firestore';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db, Ingredient, Unit, WithId } from '../../lib/firebase/interfaces';
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Show,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { IngredientCard, NewIngredientCard } from '../IngredientCards';
import IngredientForm from '../IngredientForm';
import { useAuth } from '../../hooks/useAuth';
import Fuse from 'fuse.js';
import useIngredient from '../../hooks/useIngredient';
import { useSidebar } from '../../hooks/useSidebar';
import { HamburgerIcon } from '@chakra-ui/icons';

export type IngredientFormData = {
  ingredientId?: string;
  name: string;
  price: number;
  quantity: number;
  unit: Unit;
  amount: number;
  submitter: string;
  location?: string;
  image?: string;
};

const IngredientList: FC = () => {
  const { authUser, loading: userLoading, login } = useAuth();

  const { openSidebar } = useSidebar();

  const loginHandler = useCallback(async () => {
    if (!authUser) await login();
    if (authUser) openSidebar('userActions');
  }, [authUser, login, openSidebar]);

  // TODO: switch loading from boolean to string to reference ingredient being updated/saved and show Skeleton
  const [{ submitIngredient, updateIngredient }, ingredientLoading, error] = useIngredient();
  /* Manual ingredient search
   * searchIngredient: user input into search box; not used for query
   * foundIngredient: used for desktop card card margins
   */
  const [foundIngredient, setFoundIngredient] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<WithId<Ingredient>[]>([]);

  // IngredientForm submission
  const methods = useForm<IngredientFormData>({
    defaultValues: {
      name: '',
      price: undefined,
      amount: undefined,
      unit: undefined,
      quantity: undefined,
      submitter: authUser?.uid,
    },
  });

  const { handleSubmit, reset, resetField, watch, setValue, getValues } = methods;
  const searchIngredient = watch('name');

  /* Original live-updating retrieval of specific document and its contents */
  useEffect(() => {
    if (authUser?.uid) {
      const q = query(db.ingredientCollection, where('userId', '==', authUser.uid), limit(30));

      onSnapshot(q, querySnapshot => {
        const ingredientInfoList: WithId<Ingredient>[] = [];
        querySnapshot.forEach(doc => {
          ingredientInfoList.push({ ...doc.data(), id: doc.id });
        });
        setSearchResults(ingredientInfoList);
      });
    }
  }, [authUser?.uid]);

  // Simplified fuzzy search with Fuse.js
  const filteredResults = useMemo(() => {
    const fuse = new Fuse(searchResults, {
      keys: ['name'],
      includeScore: true,
      ignoreLocation: true,
    });

    const results = fuse.search(searchIngredient);
    if (results.some(result => result.score && result.score < 0.00001)) setFoundIngredient(true);
    else setFoundIngredient(false);

    return searchIngredient
      ? results.map(result => {
          return result.item;
        })
      : searchResults;
  }, [searchIngredient, searchResults]);

  // Reset form on successful submit
  const onSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      await submitIngredient(data);
      reset();
    },
    [reset, submitIngredient],
  );

  // Modify form data for update submission
  const onUpdateTransform = useCallback(
    async (data: WithId<Ingredient>): Promise<void> => {
      setValue('name', data.name);
      setValue('ingredientId', data.id);
    },
    [setValue],
  );

  const onUpdateSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      const currentIngredient: IngredientFormData = {
        ingredientId: data.ingredientId,
        name: data.name,
        price: getValues('price'),
        quantity: getValues('quantity'),
        amount: getValues('amount'),
        unit: getValues('unit'),
        submitter: getValues('submitter'),
      };

      await updateIngredient(currentIngredient);

      // resetField('price');
      // resetField('quantity');
      // resetField('unit');
      // resetField('amount');
    },
    [getValues, resetField, updateIngredient],
  );

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <Flex>
            {/* Pricey Logo */}
            <Show above={'sm'}>
              <Center mx={'20px'}>
                {/* <SkeletonCircle isLoaded={!userLoading} fitContent> */}
                {/* <Avatar
                  boxShadow={'normal'}
                  _hover={{ boxShadow: 'hover' }}
                  cursor={'pointer'}
                  name={'Pricey'}
                  src={authUser?.photoURL}
                  aria-label={'Pricey Logo'}
                  // onClick={loginHandler}
                /> */}
                <Heading color={'blue'}>Pricey</Heading>
              </Center>
            </Show>
            <IngredientForm />

            {/* Hamburger */}
            <Show above={'sm'}>
              <Center>
                <IconButton
                  mx={'20px'}
                  variant={'outline'}
                  // borderRadius={'50%'}
                  aria-label={'Open sidepanel'}
                  icon={<HamburgerIcon />}
                  onClick={loginHandler}
                />
                {/* <SkeletonCircle isLoaded={!userLoading} fitContent> */}
                {/* <Avatar
                  mx={'20px'}
                  boxShadow={'normal'}
                  _hover={{ boxShadow: 'hover' }}
                  cursor={'pointer'}
                  name={authUser?.name}
                  src={authUser?.photoURL}
                  aria-label={'Open sidepanel'}
                  onClick={loginHandler}
                /> */}
                {/* </SkeletonCircle> */}
              </Center>
            </Show>
          </Flex>

          <Divider boxShadow={'focus'} />

          <Grid
            mx={{ base: 'unset', sm: '30px' }}
            mt={'20px'}
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
                <NewIngredientCard handleSubmit={handleSubmit(onSubmit)} />
              </GridItem>
            ) : null}

            {filteredResults?.map((item, index) => {
              // Highlighting card if ingredient is found
              const searchKeys = searchIngredient.split(' ');
              const highlighted =
                searchKeys.length > 1
                  ? searchKeys.every(value => item.name?.includes(value))
                  : false;

              return (
                <GridItem
                  ml={{ base: foundIngredient ? '30px' : '', sm: 'unset' }}
                  mr={{ base: index === filteredResults.length - 1 ? '30px' : '', sm: 'unset' }}
                  // _last={{ base: { mr: '30px' } }}
                  key={`${item.name}_${index}`}
                >
                  <IngredientCard
                    ingredientInfo={item}
                    handleSubmit={async () => {
                      await onUpdateTransform(item);
                      handleSubmit(onUpdateSubmit)();
                    }}
                    highlighted={highlighted}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </>
      </FormProvider>
    </form>
  );
};

export default IngredientList;

/* Template onSubmit callback from TheFoodWorks */
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

/* One day, text search can be simply done with Firestore
 * Currently, good solutions require backend 3rd party library (ElasticSearch, Algolia, Typesense)
 * https://cloud.google.com/firestore/docs/solutions/search
 * For now, really memory-inefficient client-sided method requires multiple queries and combining and filtering duplicates
 */
//
// export interface Ingredient {
//   plu: string;
//   category?: string;
//   commodity?: string;
//   variety?: string;
//   image?: string;
//   submissions?: string[] | FieldValue;
//   count?: number | FieldValue;
//   lastUpdated?: Timestamp | FieldValue;
// }

// export type SubmissionFormData = {
//   plu: string;
//   price: number;
//   quantity: number;
//   unit: Unit;
//   submitter: string;
//   location?: string;
// };

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

/* 2nd simpler implementation of fuzzy search using local csv file*/
// useEffect(() => {
//     csvToIngredient();
//   }, [csvToIngredient]);

//   // Simplified fuzzy search with Fuse.js
//   const filteredResults = useMemo(() => {
//     const fuse = new Fuse(csvData, {
//       keys: ['plu', 'category', { name: 'commodity', weight: 1 }, { name: 'variety', weight: 10 }],
//       // threshold: 0.5,
//       ignoreLocation: true,
//       minMatchCharLength: 1,
//     });
//     const results = fuse
//       .search(searchIngredient, { limit: 30 })
//       .filter(item => item.item.variety?.toLocaleLowerCase() != 'retailer assigned');

//     // Found Ingredient adjusts margins for card grid
//     setFoundIngredient(!!results.length);

//     return results;
//   }, [csvData, searchIngredient]);
