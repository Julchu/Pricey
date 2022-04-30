import { limit, onSnapshot, query, where } from 'firebase/firestore';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { db, IngredientInfo } from '../../lib/firebase/interfaces';
import { Column, Line, RoundedImage, Row } from '../UI/Structure';
import {
  CardInfoWrapper,
  CardWrapper,
  HomeCardGrid,
  HomeCardInfoRow,
  HomeCardLine,
  HomeImageDiv,
  HomeImageHolder,
  HomeInput,
  HomeInputGrid,
  HomeSelect,
} from './styles';
import { currencyFormatter } from '../../lib/textFormatters';

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
   * searchResults holds array of streamed results
   */
  const [searchInput, setSearchInput] = useState('');
  const [foundIngredient, setFoundIngredient] = useState(false);
  const [searchResults, setSearchResults] = useState<IngredientInfo[]>([]);

  /* Live-updating retrieval of specific document and its contents */
  useEffect(() => {
    const q = query(db.ingredientInfoCollection, where('count', '>', 0), limit(8));

    onSnapshot(q, querySnapshot => {
      const ingredientInfoList: IngredientInfo[] = [];
      querySnapshot.forEach(doc => {
        ingredientInfoList.push(doc.data());
      });
      setSearchResults(ingredientInfoList);
    });
  }, []);

  /*useEffect(() => {
    if (searchResults) console.log('entries: ', searchResults);
  }, [searchResults]);*/

  const filteredResults = useMemo(() => {
    setFoundIngredient(searchResults.some(({ name }) => searchInput === name));
    return searchResults.filter(ingredientInfo => ingredientInfo.name.includes(searchInput)).sort();
  }, [searchInput, searchResults]);

  return (
    <form>
      {/* FormProvider from ReactHookForms */}
      <FormProvider {...methods}>
        <>
          <IngredientForm setSearchInput={setSearchInput} />

          <Line />

          <Row>
            <HomeCardGrid>
              {!foundIngredient ? (
                <Card searchInput={searchInput} handleSubmit={handleSubmit(onSubmit)} />
              ) : null}

              {filteredResults?.map((ingredientInfo, index) => {
                return (
                  <Card
                    key={`${ingredientInfo.name}_${index}`}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    ingredientInfo={ingredientInfo}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                );
              })}
            </HomeCardGrid>
          </Row>
        </>
      </FormProvider>
    </form>
  );
};

const IngredientForm: FC<{
  setSearchInput: Dispatch<SetStateAction<string>>;
}> = ({ setSearchInput }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const [selectValue, setSelectValue] = useState('');

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <>
      <HomeInputGrid>
        {/* Ingredient name input */}
        <Column style={{ gridColumn: '1/3', minWidth: '500px' }}>
          <HomeInput
            type={'search'}
            {...register('name', { required: true })}
            placeholder={
              errors.name?.type === 'required'
                ? 'Ingredient name is required'
                : 'Search for an ingredient'
            }
            error={errors.name?.type === 'required'}
            onChange={e => {
              setSearchInput(e.target.value.toLocaleLowerCase('en-US'));
              clearErrors('name');
            }}
          />
        </Column>

        {/* Price input */}
        <Column style={{ minWidth: '250px' }}>
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
        <Column style={{ minWidth: '250px' }}>
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
      </HomeInputGrid>
    </>
  );
};

type CardProps = {
  ingredientInfo?: IngredientInfo;
  searchInput?: string;
  setSearchInput?: Dispatch<SetStateAction<string>>;
  handleSubmit?: () => void;
};
// Search result cards
const Card: FC<CardProps> = ({ ingredientInfo, searchInput, setSearchInput, handleSubmit }) => {
  // IngredientInfo fields
  const averagePrice =
    ingredientInfo?.total && ingredientInfo?.count
      ? (ingredientInfo.total as number) / (ingredientInfo.count as number)
      : null;

  const { setValue, resetField } = useFormContext<IngredientFormData>();

  const highlighted = searchInput === ingredientInfo?.name;
  const searchedIngredient = searchInput === ingredientInfo?.name || !ingredientInfo;

  const onClickHandler = useCallback(() => {
    if (setSearchInput && ingredientInfo && handleSubmit) {
      setValue('name', ingredientInfo?.name);
      resetField('price');
      resetField('unit');
      setSearchInput(ingredientInfo?.name);
      handleSubmit();
    }
  }, [handleSubmit, ingredientInfo, resetField, setSearchInput, setValue]);

  return (
    <CardWrapper highlighted={highlighted}>
      {/* Image */}
      <HomeImageDiv>
        <HomeImageHolder>
          {/* TODO: image uploading */}
          <RoundedImage
            src={ingredientInfo ? 'media/foodPlaceholder.png' : 'media/imageUploadIcon.png'}
            alt={ingredientInfo ? 'Food placeholder' : 'Upload image'}
            width={ingredientInfo ? '577px' : '150px'}
            height={ingredientInfo ? '433px' : '100px'}
          />
        </HomeImageHolder>
      </HomeImageDiv>

      <HomeCardLine />

      {/* Info */}
      <CardInfoWrapper onClick={searchedIngredient ? handleSubmit : onClickHandler}>
        {ingredientInfo ? (
          <HomeCardInfoRow>
            <b style={{ color: '#0070f3' }}>{ingredientInfo.name}</b>
          </HomeCardInfoRow>
        ) : (
          <HomeCardInfoRow>Add</HomeCardInfoRow>
        )}

        {averagePrice ? (
          <HomeCardInfoRow>Average: {currencyFormatter.format(averagePrice / 100)}</HomeCardInfoRow>
        ) : (
          <HomeCardInfoRow>
            <b style={{ color: '#0070f3' }}>{searchInput || 'an ingredient'}</b>
          </HomeCardInfoRow>
        )}

        <HomeCardInfoRow>
          {ingredientInfo?.lowest
            ? `Lowest: ${currencyFormatter.format(ingredientInfo.lowest / 100)}`
            : 'to the list'}
        </HomeCardInfoRow>
      </CardInfoWrapper>
    </CardWrapper>
  );
};

export default Home;
