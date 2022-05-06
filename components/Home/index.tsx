import { limit, onSnapshot, query, where } from 'firebase/firestore';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { db, IngredientInfo, Unit } from '../../lib/firebase/interfaces';
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
import { currencyFormatter, priceConverter } from '../../lib/textFormatters';
import { useUnit } from '../../contexts/UnitContext';

type HomeProps = {
  onSubmit: (data: IngredientFormData) => Promise<void>;
};

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
        <Column style={{ gridColumn: '1/3' }}>
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
            type={'search'}
            {...register('price', {
              valueAsNumber: true,
              required: true,
              validate: price => validateIsNumber(price),
            })}
            placeholder={'Price'}
            error={errors.price?.type === 'required' || errors.price?.type === 'validate'}
          />
        </Column>

        {/* Quantity input */}
        <Column style={{ minWidth: '250px' }}>
          <HomeInput
            type={'search'}
            {...register('quantity', {
              valueAsNumber: true,
              required: true,
              validate: price => validateIsNumber(price),
            })}
            placeholder={'Quantity'}
            error={errors.quantity?.type === 'required' || errors.quantity?.type === 'validate'}
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
            {Object.keys(Unit).map((unit, index) => {
              return (
                <option key={`${unit}_${index}`} value={unit}>
                  {unit}
                </option>
              );
            })}
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
  const { setValue, getValues, resetField } = useFormContext<IngredientFormData>();

  // Showing price as unit preference
  const { toggledUnit, oppositeUnit } = useUnit();

  // Setting to toggledUnit allows re-rendering of unit because it's a state
  // If unit is Unit.lb or Unit.kg, use toggledUnit; else use saved unit, or form unit
  const convertedUnit =
    ingredientInfo && (ingredientInfo.unit === Unit.lb || ingredientInfo.unit === Unit.kg)
      ? toggledUnit
      : ingredientInfo?.unit;

  const convertedTotal =
    ingredientInfo && convertedUnit
      ? priceConverter(ingredientInfo.total as number, convertedUnit, oppositeUnit)
      : 0;

  const convertedLowest =
    ingredientInfo && convertedUnit
      ? priceConverter(ingredientInfo.lowest as number, convertedUnit, oppositeUnit)
      : 0;

  // IngredientInfo fields
  const averagePrice = ingredientInfo?.count
    ? convertedTotal / (ingredientInfo.count as number)
    : 0;

  const highlighted = searchInput === ingredientInfo?.name;
  const searchedIngredient = searchInput === ingredientInfo?.name || !ingredientInfo;

  //
  // TODO: If ingredient doesn't exist, preview price
  // const previewPrice = (getValues('price') * 100) / getValues('quantity') / 100;
  // const convertedPreviewPrice = priceConverter(
  //   previewPrice,
  //   getValues('unit'),
  //   oppositeUnit,
  // );

  // const previewUnit =
  //   getValues('unit') === Unit.lb || getValues('unit') === Unit.kg
  //     ? toggledUnit
  //     : getValues('unit');

  // setSearchInput for search filter, and setValue('name') for submitting ingredient `name`
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
          <HomeCardInfoRow>Save</HomeCardInfoRow>
        )}

        {averagePrice ? (
          <HomeCardInfoRow>
            {`Average: ${currencyFormatter.format(averagePrice / 100)}/${convertedUnit}`}
          </HomeCardInfoRow>
        ) : (
          <HomeCardInfoRow>
            <b style={{ color: '#0070f3' }}>{searchInput || 'an ingredient'}</b>
          </HomeCardInfoRow>
        )}

        {/* TODO: add preview pricing */}
        <HomeCardInfoRow>
          {ingredientInfo?.lowest
            ? `Lowest: ${currencyFormatter.format(convertedLowest / 100)}/${convertedUnit}`
            : getValues('price') && getValues('quantity')
            ? 'to the list' // `${currencyFormatter.format(convertedPreviewPrice)}/${previewUnit}`
            : null}
        </HomeCardInfoRow>
      </CardInfoWrapper>
    </CardWrapper>
  );
};

export default Home;
