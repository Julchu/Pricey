import { FC, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { deleteCollection, getDocuments } from '../../hooks/useCreateIngredient';
import { Hyperlink, StripeButton } from '../UI/Buttons';
import { Column, Line, RoundedImage, Row } from '../UI/Structure';
import { CardWrapper, HomeGrid, HomeInput, HomeSelect } from './styles';

// import { Timestamp } from 'firebase/firestore';

type HomeProps = {
  onSubmit: (data: IngredientFormData) => Promise<void>;
};

export type IngredientFormData = {
  name: string;
  price: number;
  unit: string;
  location?: string;

  // Time that item was recorded
  // time?: Timestamp;
};

const defaultFormValues = (): Partial<IngredientFormData> => ({
  // Add fields that are required for object submitted to Firebase as empty strings
  name: '',
  unit: '',
  location: '',

  // Time that item was recorded
  // time?:
});

// Page shown at `localhost:3000/`
const Home: FC<HomeProps> = ({ onSubmit }) => {
  const methods = useForm<IngredientFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  // Testing for result cards
  const searchResults: IngredientFormData[] = [
    { name: 'a', price: 0, unit: 'lb' },
    { name: 'b', price: 0, unit: 'lb' },
    { name: 'c', price: 0, unit: 'lb' },
    { name: 'd', price: 0, unit: 'lb' },
  ];

  // TODO: subscription query to retrieve ingredients for cards
  // const q = query(collection(db, 'ingredients'));
  // const unsubscribe = onSnapshot(q, querySnapshot => {
  //   const ingredients = [];
  //   querySnapshot.forEach(doc => {
  //     ingredients.push(doc.data().name);
  //   });
  //   console.log(ingredients);
  // });

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IngredientForm />
          {/* <Column> */}
          {/* </Column> */}
        </form>
      </FormProvider>

      <Line />

      <Row>
        <HomeGrid>
          {/* TODO: if no results, show card to submit data (replace submit button) */}
          {searchResults.length == 0 ? <Card /> : null}

          {/* TODO: if results, add onClick to update/add data to ingredients */}
          {searchResults.map((result, index) => {
            return <Card key={`${result.name}_${index}`} result={result} />;
          })}
        </HomeGrid>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await getDocuments('ingredients');
            await getDocuments('ingredientNames');
          }}
        >
          Get Ingredients
        </Hyperlink>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await deleteCollection('ingredients');
            await deleteCollection('ingredientNames');
          }}
        >
          Delete Ingredients
        </Hyperlink>
      </Row>
    </>
  );
};

const IngredientForm: FC = () => {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const validateIsNumber = (value: number): boolean => {
    if (value) return true;
    return false;
  };

  const [selectValue, setSelectValue] = useState('');

  return (
    <>
      <Row>
        {/* Ingredient name input */}
        <Column style={{ width: '30%', marginRight: '20px' }}>
          <HomeInput
            {...register('name', { required: true })}
            placeholder={
              errors.name?.type === 'required'
                ? 'Ingredient name is required'
                : 'Search for an ingredient'
            }
            error={errors.name?.type === 'required'}
          />
        </Column>

        {/* Price input */}
        <Column style={{ width: '10%', marginRight: '20px' }}>
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
        <Column style={{ width: '10%', marginRight: '20px' }}>
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
      </Row>
    </>
  );
};

// Search result cards
const Card: FC<{ result?: IngredientFormData }> = ({ result }) => {
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
      <Row>Name: {result?.name}</Row>
      <Row>Price: ${result?.price}</Row>
      <Row>Unit: {result?.unit}</Row>
      {/* <Row>Location: {location}</Row> */}
    </CardWrapper>
  );
};

export default Home;
