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
    const q = query(db.ingredientInfoCollection, where('count', '>', 0), limit(8));

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
            <HomeCardGrid>
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
            </HomeCardGrid>
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
              setNewIngredient({
                ...newIngredient,
                name: e.target.value.toLocaleLowerCase('en-US'),
              });

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
            onChange={e => {
              setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) });
              clearErrors('price');
            }}
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
            onChange={e => {
              setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) });
              clearErrors('quantity');
            }}
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
        </Column>
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
  const { setValue } = useFormContext<IngredientFormData>();

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
  const onClickHandler = useCallback(() => {
    if (ingredientInfo && handleSubmit && newIngredient && setNewIngredient) {
      setValue('name', ingredientInfo?.name);
      setNewIngredient({ ...newIngredient, name: ingredientInfo.name });
      handleSubmit();
    }
  }, [ingredientInfo, handleSubmit, newIngredient, setNewIngredient, setValue]);

  return (
    <CardWrapper highlighted={highlighted}>
      {/* Image */}
      <HomeImageDiv>
        <HomeImageHolder>
          {/* TODO: image uploading */}
          <RoundedImage
            src={'media/foodPlaceholder.png'}
            alt={'Food placeholder'}
            width={'577px'}
            height={'433px'}
          />
        </HomeImageHolder>
      </HomeImageDiv>

      <HomeCardLine />

      {/* Info */}
      <CardInfoWrapper onClick={onClickHandler}>
        <HomeCardInfoRow>
          <b style={{ color: '#0070f3' }}>{ingredientInfo?.name}</b>
        </HomeCardInfoRow>

        <HomeCardInfoRow>
          Avg: {currencyFormatter.format(averagePrice / 100)}/{unitFormatter(convertedUnit)}
        </HomeCardInfoRow>

        <HomeCardInfoRow>
          Low: {currencyFormatter.format(convertedLowest / 100)}/{unitFormatter(convertedUnit)}
        </HomeCardInfoRow>
      </CardInfoWrapper>
    </CardWrapper>
  );
};

// Search result cards
const NewCard: FC<CardProps> = ({ handleSubmit, newIngredient }) => {
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

  return (
    <CardWrapper>
      {/* Image */}
      <HomeImageDiv>
        <HomeImageHolder>
          {/* TODO: image uploading */}
          <RoundedImage
            src={'media/imageUploadIcon.png'}
            alt={'Upload image'}
            width={'150px'}
            height={'100px'}
          />
        </HomeImageHolder>
      </HomeImageDiv>

      <HomeCardLine />

      {/* Info */}
      <CardInfoWrapper onClick={handleSubmit}>
        <HomeCardInfoRow>Save</HomeCardInfoRow>

        <HomeCardInfoRow>
          <b style={{ color: '#0070f3' }}>{newIngredient?.name || 'an ingredient'}</b>
        </HomeCardInfoRow>

        {/* TODO: add preview pricing */}
        {newIngredient && newIngredient.price && newIngredient.quantity && newIngredient.unit ? (
          <HomeCardInfoRow>
            {currencyFormatter.format(convertedPreviewPrice)}/{unitFormatter(convertedUnit)}
          </HomeCardInfoRow>
        ) : null}
      </CardInfoWrapper>
    </CardWrapper>
  );
};

export default Home;
