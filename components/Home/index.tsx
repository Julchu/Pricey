import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { db } from '../../lib/firebase';
import { IngredientInfo } from '../../lib/firebase/interfaces';
import { StripeButton } from '../UI/Buttons';
import { Column, Grid, Line, RoundedImage, Row } from '../UI/Structure';
import { CardInfoWrapper, CardWrapper, HomeGrid, HomeInput, HomeSelect } from './styles';

type HomeProps = {
  onSubmit: (data: IngredientFormData) => Promise<void>;
};

export type IngredientFormData = {
  name: string;
  price: number;
  unit: string;
  location?: string;
};

const defaultFormValues = (): Partial<IngredientFormData> => ({
  // Add fields that are required for object submitted to Firebase as empty strings
  name: '',
  unit: '',
  location: '',
});

// Page shown at `localhost:3000/`
const Home: FC<HomeProps> = ({ onSubmit }) => {
  // React Hook Form
  const methods = useForm<IngredientFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  /* Manual ingredient search
   * searchInput: is used for filtering search results after query
   * searchFirstLetter: is to ensure query is only ran if first letter is different, to access the different document
   * searchResults holds array of streamed results
   */
  const [searchInput, setSearchInput] = useState('');
  const [searchFirstLetter, setSearchFirstLetter] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentData | undefined>([]);

  /* Live-updating retrieval of specific document and its contents */
  useEffect(() => {
    onSnapshot(doc(db, 'ingredientInfo', searchFirstLetter || 'a'), doc => {
      doc.exists() ? setSearchResults(doc.data()) : setSearchResults([]);
    });
  }, [searchFirstLetter]);

  /*useEffect(() => {
      if (searchResults) console.log('entries: ', searchResults);
    }, [searchResults]);*/

  const filteredResults = useMemo(() => {
    if (searchResults)
      return Object.entries(searchResults).filter(([name, info]) => {
        if (name.includes(searchInput)) return info;
      });
  }, [searchInput, searchResults]);

  return (
    <>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IngredientForm
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setSearchFirstLetter={setSearchFirstLetter}
          />
        </form>
      </FormProvider>

      <Line />

      <Row>
        <HomeGrid>
          {/* TODO: if no results, show card to submit data (replace submit button) */}
          {/* {searchResults?.length === 0 ? <Card /> : null} */}

          {/* TODO: if results, add onClick to update/add data to ingredients */}
          {filteredResults?.map(([name, info], index) => {
            return <Card key={`${name}_${index}`} name={name} info={info} />;
          })}
        </HomeGrid>
      </Row>
    </>
  );
};

const IngredientForm: FC<{
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  setSearchFirstLetter: Dispatch<SetStateAction<string>>;
}> = ({ searchInput, setSearchInput, setSearchFirstLetter }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const setFirstLetter = (input: string): void => {
    if (input && input[0] !== searchInput[0]) {
      setSearchFirstLetter(input[0]);
    }
  };

  const [selectValue, setSelectValue] = useState('');

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <>
      <Grid
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 250px)',
          columnGap: '30px',
          rowGap: '30px',
        }}
      >
        {/* Ingredient name input */}
        <Column>
          <HomeInput
            {...register('name', { required: true })}
            placeholder={
              errors.name?.type === 'required'
                ? 'Ingredient name is required'
                : 'Search for an ingredient'
            }
            error={errors.name?.type === 'required'}
            onChange={e => {
              setSearchInput(e.target.value);
              setFirstLetter(e.target.value[0]);
              clearErrors('name');
            }}
          />
        </Column>

        {/* Price input */}
        <Column>
          <HomeInput
            {...register('price', {
              valueAsNumber: true,
              required: true,
              validate: price => validateIsNumber(price),
            })}
            placeholder={'Price'}
            error={errors.price?.type === 'required' || errors.price?.type === 'validate'}
          />
        </Column>

        {/* TODO: create custom dropdown menu styling */}
        {/* Unit selector */}
        <Column>
          <HomeSelect
            {...register('unit', {
              required: true,
            })}
            error={errors.unit?.type === 'required'}
            onChange={e => {
              setSelectValue(e.target.value);
              clearErrors('unit');
            }}
            value={selectValue}
          >
            <option value="" disabled hidden>
              Unit
            </option>
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </HomeSelect>
        </Column>

        {/* Replace button with empty card (when no results) */}
        <StripeButton>Submit data</StripeButton>
      </Grid>
    </>
  );
};

// Search result cards
const Card: FC<{ name?: string; info?: IngredientInfo }> = ({ name, info }) => {
  const averagePrice =
    info?.total && info?.count ? (info?.total as number) / (info?.count as number) : null;

  return (
    <CardWrapper>
      {/* Image */}
      <RoundedImage
        src={'media/foodPlaceholder.png'}
        alt="Food placeholder"
        width="577px"
        height="433px"
      />

      {/* Info */}
      <CardInfoWrapper>
        <Row style={{ wordWrap: 'break-word' }}>Name: {name}</Row>
        {averagePrice ? <Row>Average: ${averagePrice / 100}</Row> : null}
        {info?.lowest ? <Row>Lowest: ${info?.lowest / 100}</Row> : null}
      </CardInfoWrapper>
    </CardWrapper>
  );
};

export default Home;
