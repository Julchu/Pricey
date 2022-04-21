import { FC } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { deleteUsers, getUsers, setUsers } from '../../lib/firebase';
import { Hyperlink, StripeButton } from '../UI/Buttons';
import { Input } from '../UI/Form';
import { Column, Grid, Line, Row } from '../UI/Structure';

// import { Timestamp } from 'firebase/firestore';

type HomeProps = {
  onSubmit: (data: SearchFormData) => Promise<void>;
};

export type SearchFormData = {
  name: string;
  price: number;
  unit: string;
  location?: string;

  // Time that item was recorded
  // time?: Timestamp;
};

const defaultFormValues = (): Partial<SearchFormData> => ({
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
  } = useFormContext<SearchFormData>();

  return (
    <>
      <Row>
        <Column style={{ width: '30%', marginRight: '20px' }}>
          <Input {...register('name', { required: true })} placeholder="Search for an ingredient" />
          {errors.name?.type === 'required' && 'Ingredient name is required'}
        </Column>
        <Column style={{ width: '10%', marginRight: '20px' }}>
          <Input
            {...register('price', { valueAsNumber: true, required: false })}
            placeholder="Price"
          />
          {errors.price?.type === 'required' && 'Price is required'}
        </Column>
        <Column style={{ width: '10%', marginRight: '20px' }}>
          <Input {...register('unit', { required: true })} placeholder="Unit" />
          {errors.unit?.type === 'required' && 'Unit is required'}
        </Column>
        <StripeButton>Submit data</StripeButton>

        {/* Controller for unit dropdown */}
        {/* <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          <Controller
            name="select"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'chocolate', label: 'Chocolate' },
                  { value: 'strawberry', label: 'Strawberry' },
                  { value: 'vanilla', label: 'Vanilla' },
                ]}
              />
            )}
          /> */}
      </Row>
    </>
  );
};

// Page shown at `localhost:3000/`
const Home: FC<HomeProps> = ({ onSubmit }) => {
  const methods = useForm<SearchFormData>({ defaultValues: defaultFormValues() });
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
            // TODO: connect to Firestore
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
