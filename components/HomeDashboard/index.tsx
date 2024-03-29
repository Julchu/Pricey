import { FC, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Unit } from '../../lib/firebase/interfaces';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { IngredientCard, NewIngredientCard } from './ingredientCards';
import IngredientForm from './ingredientForm';
import Fuse from 'fuse.js';
import { useIngredientContext } from '../../hooks/useIngredientContext';

export type IngredientFormData = {
  ingredientId?: string;
  name: string;
  price: number;
  quantity: number;
  unit: Unit;
  capacity: number;
  location?: string;
  image?: string;
};

const IngredientList: FC = () => {
  const { currentIngredients } = useIngredientContext();
  // IngredientForm submission
  const methods = useForm<IngredientFormData>({
    defaultValues: {
      name: '',
      price: undefined,
      capacity: undefined,
      unit: undefined,
      quantity: undefined,
    },
  });

  // TODO: switch loading from boolean to string to reference ingredient being updated/saved and show Skeleton
  /* Manual ingredient search
   * foundIngredient: used for desktop card card margins
   * searchIngredient: user input into search box; not used for query
   */
  const [foundIngredient, setFoundIngredient] = useState<string>('');

  const { watch } = methods;
  const searchIngredient = watch('name');

  // Simplified fuzzy search with Fuse.js
  const filteredResults = useMemo(() => {
    const fuse = new Fuse(currentIngredients, {
      keys: ['name'],
      includeScore: true,
      ignoreLocation: true,
    });

    const results = fuse.search(searchIngredient || '');

    const found = results.find(result => result.item.name === searchIngredient)?.item || {
      documentId: '',
    };

    if (found.documentId) setFoundIngredient(found.documentId);
    else setFoundIngredient('');

    return searchIngredient
      ? results.map(result => {
          return result.item;
        })
      : currentIngredients;
  }, [currentIngredients, searchIngredient]);

  return (
    <form>
      <FormProvider {...methods}>
        <Flex h="calc(100svh - 80px)" flexDir={'column'} display={{ base: 'flex', sm: 'block' }}>
          {/* FormProvider from ReactHookForms */}
          <Flex flexDir={{ base: 'column', sm: 'row' }}>
            <IngredientForm />
          </Flex>

          <Grid
            flexGrow={{ base: 1, sm: 'unset' }}
            // px: 0px required for mobile when no ingredients found
            p={{ base: '30px 0px', sm: '0px 30px' }}
            mt={'header'}
            autoFlow={{ base: 'column', sm: 'row' }}
            rowGap={'30px'}
            columnGap={{ base: '100%', sm: '30px' }}
            overflowX={{ base: 'scroll', sm: 'visible' }}
            overflowY={{ base: 'hidden', sm: 'visible' }}
            scrollSnapType={{ base: 'x mandatory', sm: 'none' }}
            templateColumns={{
              base: 'repeat(auto-fill, minmax(100%, 1fr))',
              sm: 'repeat(auto-fill, 250px)',
            }}
          >
            {!foundIngredient ? (
              <GridItem h="100%">
                <NewIngredientCard />
              </GridItem>
            ) : null}

            {filteredResults?.map((item, index) => {
              const highlighted = item.documentId === foundIngredient;

              return (
                <GridItem
                  mr={{ base: index === filteredResults.length - 1 ? '30px' : '' }}
                  key={`${item.name}_${index}`}
                >
                  <IngredientCard ingredientInfo={item} highlighted={highlighted} />
                </GridItem>
              );
            })}
          </Grid>
        </Flex>
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
