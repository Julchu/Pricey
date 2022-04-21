import { FC, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { deleteUsers, getUsers, setUsers } from '../../hooks/testFirestore';
import { Hyperlink, StripeButton } from '../UI/Buttons';
import { Input, Select } from '../UI/Form';
import { Column, Grid, Line, Row } from '../UI/Structure';

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

const IngredientForm: FC = () => {
  const {
    register,
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
        <Column style={{ width: '30%', marginRight: '20px' }}>
          <Input
            {...register('name', { required: true })}
            placeholder={
              errors.name?.type === 'required'
                ? 'Ingredient name is required'
                : 'Search for an ingredient'
            }
            error={errors.name?.type === 'required'}
          />
        </Column>
        <Column style={{ width: '10%', marginRight: '20px' }}>
          <Input
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
        <Column style={{ width: '10%', marginRight: '20px' }}>
          <Select
            {...register('unit', {
              required: true,
            })}
            error={errors.unit?.type === 'required'}
            onChange={e => setSelectValue(e.target.value)}
            value={selectValue}
          >
            {/* TODO: custom error handling for unit: unit stays red after fix until submit */}
            <option value="" disabled hidden>
              Unit
            </option>
            <option value="lb">lb</option>
            <option value="kg">kg</option>
          </Select>
        </Column>

        <StripeButton>Submit data</StripeButton>
      </Row>
    </>
  );
};

// Page shown at `localhost:3000/`
const Home: FC<HomeProps> = ({ onSubmit }) => {
  const methods = useForm<IngredientFormData>({ defaultValues: defaultFormValues() });
  const { handleSubmit } = methods;

  // Testing for result cards
  const searchResults = ['a', 'b', 'c', 'd'];

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
        <Grid>
          {searchResults.map((letter, index) => {
            return <Card key={`${letter}_${index}`} letter={letter} />;
          })}
        </Grid>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await setUsers();
          }}
        >
          setUsers
        </Hyperlink>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await getUsers();
          }}
        >
          getUsers
        </Hyperlink>
      </Row>
      <Row>
        <Hyperlink
          onClick={async () => {
            await deleteUsers('users');
          }}
        >
          deleteUsers
        </Hyperlink>
      </Row>
    </>
  );
};

// Search result cards
const Card: FC<{ letter: string }> = ({ letter }) => {
  return <>{letter}</>;
};

export default Home;
