import { onSnapshot, query, where } from 'firebase/firestore';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db, IngredientInfo, Unit } from '../../lib/firebase/interfaces';
import { Box, Grid } from '@chakra-ui/react';
import useCreateIngredient from '../../hooks/useCreateIngredient';
import { IngredientCard, NewIngredientCard } from '../IngredientCards';
import IngredientForm from '../IngredientForm';

export type IngredientFormData = {
  name: string;
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
  const [{ createIngredient }, _loading, _error] = useCreateIngredient();

  const onSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      await createIngredient(data);
    },
    [createIngredient],
  );

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
    name: '',
    price: NaN,
    quantity: NaN,
    unit: '' as Unit,
  });
  const [foundIngredient, setFoundIngredient] = useState(false);
  const [searchResults, setSearchResults] = useState<IngredientInfo[]>([]);

  /* Live-updating retrieval of specific document and its contents */
  useEffect(() => {
    const q = query(db.ingredientInfoCollection, where('count', '>', 0) /*limit(8)*/);

    onSnapshot(q, querySnapshot => {
      const ingredientInfoList: IngredientInfo[] = [];
      querySnapshot.forEach(doc => {
        ingredientInfoList.push(doc.data());
      });
      setSearchResults(ingredientInfoList);
    });
  }, []);

  const filteredResults = useMemo(() => {
    setFoundIngredient(searchResults.some(({ name }) => newIngredient.name === name));
    return searchResults
      .filter(ingredientInfo => ingredientInfo.name.includes(newIngredient.name || ''))
      .sort();
  }, [searchResults, newIngredient.name]);

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <IngredientForm newIngredient={newIngredient} setNewIngredient={setNewIngredient} />

          {/* Line separating header form and cards */}
          <Box my={'20px'} borderTop={'1px solid lightgrey'} boxShadow={'focus'} />

          <Grid
            mx={'30px'}
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
              <NewIngredientCard
                handleSubmit={handleSubmit(onSubmit)}
                newIngredient={newIngredient}
                setNewIngredient={setNewIngredient}
              />
            ) : null}

            {filteredResults?.map((ingredientInfo, index) => {
              return (
                <IngredientCard
                  key={`${ingredientInfo.name}_${index}`}
                  ingredientInfo={ingredientInfo}
                  handleSubmit={handleSubmit(onSubmit)}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                />
              );
            })}
          </Grid>
        </>
      </FormProvider>
    </form>
  );
};

export default IngredientList;
