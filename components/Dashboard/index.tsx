import { onSnapshot, query, where } from 'firebase/firestore';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db, Ingredient, Unit } from '../../lib/firebase/interfaces';
import { Box, Grid, GridItem, Spinner } from '@chakra-ui/react';
import useIngredient from '../../hooks/useCreateIngredient';
import { IngredientCard, NewIngredientCard } from '../IngredientCards';
import IngredientForm from '../IngredientForm';
import { useAuth } from '../../hooks/useAuth';

export type IngredientFormData = {
  variety: string;
  price: number;
  quantity: number;
  unit: Unit;
  location?: string;
};

const defaultFormValues = (): Partial<IngredientFormData> => ({
  // Add fields that are required for object submitted to Firebase as empty strings
  // submitter: '',
  // location: '',
  // timestamp
  unit: undefined,
});

const IngredientList: FC = () => {
  const [{ submitIngredient }, _loading, _error] = useIngredient();
  const { loading } = useAuth();

  const onSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      await submitIngredient(data);
    },
    [submitIngredient],
  );

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

  // React Hook Form
  const methods = useForm<IngredientFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  /* Manual ingredient search
   * searchInput: is used for filtering search results after query
   * searchResults holds array of streamed results
   */
  const [newIngredient, setNewIngredient] = useState<IngredientFormData>({
    variety: '',
    price: NaN,
    quantity: NaN,
    unit: '' as Unit,
  });
  const [foundIngredient, setFoundIngredient] = useState(false);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);

  /* Live-updating retrieval of specific document and its contents */
  useEffect(() => {
    const q = query(db.ingredientCollection, where('count', '>', 0) /*limit(8)*/);

    onSnapshot(q, querySnapshot => {
      const ingredientInfoList: Ingredient[] = [];
      querySnapshot.forEach(doc => {
        ingredientInfoList.push(doc.data());
      });
      setSearchResults(ingredientInfoList);
    });
  }, []);

  // const filteredResults = useMemo(() => {
  //   setFoundIngredient(searchResults.some(({ variety }) => newIngredient.variety === variety));
  //   return searchResults
  //     .filter(ingredientInfo => ingredientInfo?.variety.includes(newIngredient.variety || ''))
  //     .sort();
  // }, [searchResults, newIngredient.variety]);

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <IngredientForm newIngredient={newIngredient} setNewIngredient={setNewIngredient} />

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
            {!foundIngredient ? (
              <GridItem>
                <NewIngredientCard
                  handleSubmit={handleSubmit(onSubmit)}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                />
              </GridItem>
            ) : null}

            {/* {filteredResults?.map((ingredientInfo, index) => {
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
            })} */}
          </Grid>
        </>
      </FormProvider>
      {loading ? <Spinner /> : null}
    </form>
  );
};

export default IngredientList;
