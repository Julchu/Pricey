import { onSnapshot, query, where } from 'firebase/firestore';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { db, IngredientInfo, Unit } from '../../lib/firebase/interfaces';
import { Line, RoundedImage, Row } from '../UI/Structure';
import {
  CardGrid,
  CardImageDiv,
  CardImageHolder,
  CardInfoRow,
  CardInfoWrapper,
  CardLine,
  CardWrapper,
  HomeInput,
  HomeInputColumn,
  HomeInputGrid,
  HomeSelect,
} from './styles';
import {
  currencyFormatter,
  isArea,
  isMass,
  priceConverter,
  unitFormatter,
} from '../../lib/textFormatters';
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
  unit: undefined,
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

          <Line />

          <Row>
            <CardGrid>
              {!foundIngredient ? (
                <NewCard
                  handleSubmit={handleSubmit(onSubmit)}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                />
              ) : null}

              {filteredResults?.map((ingredientInfo, index) => {
                return (
                  <Card
                    key={`${ingredientInfo.name}_${index}`}
                    ingredientInfo={ingredientInfo}
                    handleSubmit={handleSubmit(onSubmit)}
                    newIngredient={newIngredient}
                    setNewIngredient={setNewIngredient}
                  />
                );
              })}
            </CardGrid>
          </Row>
        </>
      </FormProvider>
    </form>
  );
};

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
      <HomeInputGrid>
        {/* Ingredient name input */}
        <HomeInputColumn index={0}>
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
              setNewIngredient({
                ...newIngredient,
                name: e.target.value.toLocaleLowerCase('en-US').trim(),
              });

              clearErrors('name');
            }}
          />
        </HomeInputColumn>

        {/* Price input */}
        <HomeInputColumn>
          <HomeInput
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
            error={errors.price?.type === 'required' || errors.price?.type === 'validate'}
          />
        </HomeInputColumn>

        {/* Quantity input */}
        <HomeInputColumn>
          <HomeInput
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
            error={errors.quantity?.type === 'required' || errors.quantity?.type === 'validate'}
          />
        </HomeInputColumn>

        {/* TODO: create custom dropdown menu styling */}
        {/* Unit selector */}
        <HomeInputColumn>
          <HomeSelect
            {...register('unit', {
              required: true,
            })}
            error={errors.unit?.type === 'required'}
            onChange={e => {
              setNewIngredient({ ...newIngredient, unit: e.target.value as Unit });
              clearErrors('unit');
            }}
            value={newIngredient.unit}
          >
            <option value="" disabled hidden>
              Unit
            </option>
            {Object.values(Unit).map((unit, index) => {
              return (
                <option key={`${unit}_${index}`} value={unit}>
                  {unitFormatter(unit)}
                </option>
              );
            })}
          </HomeSelect>
        </HomeInputColumn>
      </HomeInputGrid>
    </>
  );
};

type CardProps = {
  ingredientInfo?: IngredientInfo;
  handleSubmit?: () => void;
  newIngredient?: IngredientFormData;
  setNewIngredient?: Dispatch<SetStateAction<IngredientFormData>>;
};

// Search result cards
const Card: FC<CardProps> = ({ ingredientInfo, handleSubmit, newIngredient, setNewIngredient }) => {
  const {
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  // Showing price as unit preference
  const { currentUnit } = useUnit();

  /* Setting to currentUnit allows re-rendering of unit because it's a state
   * If unit is mass, use Unit.lb;
   * Else if unit is area, use Unit.squareFeet
   * Else use saved unit or submission form unit
   */
  const convertedUnit =
    ingredientInfo && isMass(ingredientInfo.unit)
      ? currentUnit.mass
      : ingredientInfo && isArea(ingredientInfo.unit)
      ? currentUnit.area
      : ingredientInfo?.unit;

  const convertedTotal = ingredientInfo
    ? priceConverter(ingredientInfo.total as number, ingredientInfo.unit, currentUnit)
    : 0;

  const convertedLowest = ingredientInfo
    ? priceConverter(ingredientInfo.lowest as number, ingredientInfo.unit, currentUnit)
    : 0;

  // IngredientInfo fields
  const averagePrice = ingredientInfo?.count
    ? convertedTotal / (ingredientInfo.count as number)
    : 0;

  // Highlighting cards
  const highlighted = newIngredient?.name === ingredientInfo?.name;

  // setSearchInput for search filter, and setValue('name') for submitting ingredient `name`
  const onClickHandler = useCallback(async () => {
    if (ingredientInfo && handleSubmit && newIngredient && setNewIngredient) {
      setValue('name', ingredientInfo.name);

      await handleSubmit();

      if (Object.keys(errors).length === 0) {
        resetField('name');
        resetField('price');
        resetField('quantity');

        setNewIngredient({ ...newIngredient, name: ingredientInfo.name, unit: '' as Unit });
      }
    }
  }, [ingredientInfo, handleSubmit, newIngredient, setNewIngredient, setValue, errors, resetField]);

  return (
    <CardWrapper highlighted={highlighted}>
      {/* Image */}
      <CardImageDiv>
        <CardImageHolder>
          {/* TODO: image uploading */}
          <RoundedImage
            src={'media/foodPlaceholder.png'}
            alt={'Food placeholder'}
            width={'300px'}
            height={'200px'}
          />
        </CardImageHolder>
      </CardImageDiv>

      <CardLine />

      {/* Info */}
      <CardInfoWrapper onClick={onClickHandler}>
        <CardInfoRow>
          <b style={{ color: '#0070f3', whiteSpace: 'nowrap' }}>{ingredientInfo?.name}</b>
        </CardInfoRow>

        <CardInfoRow>
          Avg: {currencyFormatter.format(averagePrice / 100)}/{unitFormatter(convertedUnit)}
        </CardInfoRow>

        <CardInfoRow>
          Low: {currencyFormatter.format(convertedLowest / 100)}/{unitFormatter(convertedUnit)}
        </CardInfoRow>
      </CardInfoWrapper>
    </CardWrapper>
  );
};

// Search result cards
const NewCard: FC<CardProps> = ({ handleSubmit, newIngredient, setNewIngredient }) => {
  const {
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  // Showing price as unit preference
  const { currentUnit } = useUnit();

  // Preview new ingredient information
  const previewPrice = newIngredient
    ? (newIngredient?.price * 100) / newIngredient?.quantity / 100
    : 0;

  const convertedUnit = isMass(newIngredient?.unit)
    ? currentUnit.mass
    : isArea(newIngredient?.unit)
    ? currentUnit.area
    : newIngredient?.unit;

  const convertedPreviewPrice = priceConverter(previewPrice, newIngredient?.unit, currentUnit);

  // setSearchInput for search filter, and setValue('name') for submitting ingredient `name`
  const onClickHandler = useCallback(async () => {
    if (handleSubmit && newIngredient && setNewIngredient) {
      setValue('name', newIngredient.name);

      await handleSubmit();

      if (Object.keys(errors).length === 0) {
        resetField('name');
        resetField('price');
        resetField('quantity');

        setNewIngredient({ ...newIngredient, name: newIngredient.name, unit: '' as Unit });
      }
    }
  }, [handleSubmit, newIngredient, setNewIngredient, setValue, errors, resetField]);

  return (
    <CardWrapper>
      {/* Image */}
      <CardImageDiv>
        <CardImageHolder>
          {/* TODO: image uploading */}
          <RoundedImage
            src={'media/imageUploadIcon.png'}
            alt={'Upload image'}
            width={'150px'}
            height={'100px'}
          />
        </CardImageHolder>
      </CardImageDiv>

      <CardLine />

      {/* Info */}
      <CardInfoWrapper onClick={onClickHandler}>
        <CardInfoRow>Save</CardInfoRow>

        <CardInfoRow>
          <b style={{ color: '#0070f3' }}>{newIngredient?.name || 'an ingredient'}</b>
        </CardInfoRow>

        {/* TODO: add preview pricing */}
        {newIngredient && newIngredient.price && newIngredient.quantity && newIngredient.unit ? (
          <CardInfoRow>
            {currencyFormatter.format(convertedPreviewPrice)}/{unitFormatter(convertedUnit)}
          </CardInfoRow>
        ) : null}
      </CardInfoWrapper>
    </CardWrapper>
  );
};

export default Home;
