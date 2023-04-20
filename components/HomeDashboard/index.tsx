import { limit, onSnapshot, query, where } from 'firebase/firestore';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db, Ingredient, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { IngredientCard, NewIngredientCard } from '../Ingredients/ingredientCards';
import IngredientForm from '../Ingredients/ingredientForm';
import { useAuth } from '../../hooks/useAuth';
import Fuse from 'fuse.js';

export type IngredientFormData = {
  ingredientId?: string;
  name: string;
  price: number;
  quantity: number;
  unit: Unit;
  measurement: number;
  submitter: string;
  location?: string;
  image?: string;
};

const IngredientList: FC = () => {
  const { authUser } = useAuth();

  // TODO: switch loading from boolean to string to reference ingredient being updated/saved and show Skeleton
  /* Manual ingredient search
   * foundIngredient: used for desktop card card margins
   * searchIngredient: user input into search box; not used for query
   */
  const [foundIngredient, setFoundIngredient] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WithDocId<Ingredient>[]>([]);

  // IngredientForm submission
  const methods = useForm<IngredientFormData>({
    defaultValues: {
      name: '',
      price: undefined,
      measurement: undefined,
      unit: undefined,
      quantity: undefined,
      submitter: authUser?.uid,
    },
  });

  const { watch } = methods;
  const searchIngredient = watch('name');

  /* Original live-updating retrieval of specific document and its contents */
  useEffect(() => {
    if (authUser?.uid) {
      const q = query(db.ingredientCollection, where('userId', '==', authUser.uid), limit(30));

      onSnapshot(q, querySnapshot => {
        const ingredientInfoList: WithDocId<Ingredient>[] = [];
        querySnapshot.forEach(doc => {
          ingredientInfoList.push({ ...doc.data(), documentId: doc.id });
        });
        setSearchResults(ingredientInfoList);
      });
    } else {
      setSearchResults([]);
    }
  }, [authUser?.uid]);

  // Simplified fuzzy search with Fuse.js
  const filteredResults = useMemo(() => {
    const fuse = new Fuse(searchResults, {
      keys: ['name'],
      includeScore: true,
      ignoreLocation: true,
    });

    const results = fuse.search(searchIngredient || '');
    const found = results.find(result => result.score && result.score < 0.00001)?.item || {
      documentId: '',
    };
    if (found.documentId) setFoundIngredient(found.documentId);
    else setFoundIngredient('');

    return searchIngredient
      ? results.map(result => {
          return result.item;
        })
      : searchResults;
  }, [searchIngredient, searchResults]);

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <Flex flexDir={{ base: 'column', sm: 'row' }}>
            <IngredientForm />
          </Flex>

          {/* <Divider boxShadow={'focus'} /> */}

          <Grid
            p={{ base: '30px', sm: '0px 30px' }}
            mt={'20px'}
            autoFlow={{ base: 'column', sm: 'row' }}
            rowGap={'30px'}
            columnGap={{ base: '100%', sm: '30px' }}
            overflowX={{ base: 'scroll', sm: 'visible' }}
            overflowY={{ base: 'hidden', sm: 'visible' }}
            scrollSnapType={['x mandatory', 'none']}
            templateColumns={{
              base: 'repeat(auto-fill, minmax(150px, 1fr))',
              sm: 'repeat(auto-fill, 250px)',
            }}
            justifyContent={{ sm: 'space-between' }}
          >
            {!foundIngredient ? (
              <GridItem>
                <NewIngredientCard />
              </GridItem>
            ) : null}

            {filteredResults?.map((item, index) => {
              const highlighted = item.documentId === foundIngredient;

              return (
                <GridItem
                  ml={{ base: foundIngredient ? '30px' : '' }}
                  mr={{ base: index === filteredResults.length - 1 ? '30px' : '' }}
                  key={`${item.name}_${index}`}
                >
                  <IngredientCard ingredientInfo={item} highlighted={highlighted} />
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
