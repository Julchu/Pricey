import { onSnapshot, query, where } from 'firebase/firestore';
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { db, IngredientInfo, Unit } from '../../lib/firebase/interfaces';
import { Box, Grid, Input, Select } from '@chakra-ui/react';
import useCreateIngredient from '../../hooks/useCreateIngredient';
import { IngredientCard, NewIngredientCard } from '../IngredientCards';
import { unitFormatter } from '../../lib/textFormatters';

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

// TODO: after submitting an ingredient, reset search to empty
const IngredientForm: FC<{
  newIngredient: IngredientFormData;
  setNewIngredient: Dispatch<SetStateAction<IngredientFormData>>;
}> = ({ newIngredient, setNewIngredient }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <>
      <Grid
        m={'30px 30px 0px'}
        gridTemplateColumns={{ base: 'auto', sm: 'repeat(5, 1fr)' }}
        gap={'30px'}
      >
        {/* Ingredient name input */}
        <Input
          gridColumn={{ sm: '1/3' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          width={'100%'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color: errors.name?.type === 'required' ? 'red' : 'grey',
          }}
          type={'search'}
          {...register('name', { required: true })}
          placeholder={
            errors.name?.type === 'required'
              ? 'Ingredient name is required'
              : 'Search for an ingredient'
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewIngredient({
              ...newIngredient,
              name: e.target.value.toLocaleLowerCase('en-US').trim(),
            });

            clearErrors('name');
          }}
        />

        {/* Price input */}
        {/* TODO: aria-invalid with isInvalid in Chakra: errors.price?.type === 'required' || errors.price?.type === 'validate' */}

        <Input
          minWidth={{ sm: '250px' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color:
              errors.price?.type === 'required' || errors.price?.type === 'validate'
                ? 'red'
                : 'grey',
          }}
          type={'search'}
          {...register('price', {
            valueAsNumber: true,
            required: true,
            validate: price => validateIsNumber(price),
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) });
            clearErrors('price');
          }}
          placeholder={'Price'}
        />

        {/* Quantity input */}

        <Input
          minWidth={{ sm: '250px' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color:
              errors.quantity?.type === 'required' || errors.quantity?.type === 'validate'
                ? 'red'
                : 'grey',
          }}
          type={'search'}
          {...register('quantity', {
            valueAsNumber: true,
            required: true,
            validate: price => validateIsNumber(price),
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) });
            clearErrors('quantity');
          }}
          placeholder={'Quantity'}
        />

        {/* TODO: create custom dropdown menu styling */}
        {/* Unit selector */}

        <Select
          minWidth={{ sm: '250px' }}
          letterSpacing={'2px'}
          color={
            errors.unit?.type === 'required' || errors.unit?.type === 'validate' ? 'red' : 'grey'
          }
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          boxShadow={{ sm: 'normal' }}
          borderRadius={'5px'}
          transition={'box-shadow 0.2s ease-in-out'}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          {...register('unit', {
            required: true,
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, unit: e.target.value as Unit });
            clearErrors('unit');
          }}
          value={newIngredient.unit}
          placeholder={'Unit'}
        >
          {Object.values(Unit).map((unit, index) => {
            return (
              <option key={`${unit}_${index}`} value={unit}>
                {unitFormatter(unit)}
              </option>
            );
          })}
        </Select>
      </Grid>
    </>
  );
};

export default IngredientList;
