import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AbsoluteCenter,
  Card,
  CardBody,
  CardHeader,
  Image,
  Stat,
  StatArrow,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PersonalIngredient, WithDocId } from '../../lib/firebase/interfaces';
import { IngredientFormData } from '.';
import { useUnitContext } from '../../hooks/useUnitContext';
import {
  calcIndividualPrice,
  currencyFormatter,
  getPercentChange,
  percentageFormatter,
  priceConverter,
  unitConverter,
} from '../../lib/textFormatters';
import useIngredientHook from '../../hooks/useIngredientHook';

type CardProps = {
  ingredientInfo: WithDocId<PersonalIngredient>;
  highlighted?: boolean;
};

// TODO: hovering over existing cards should show detailed information
// Search result cards
export const IngredientCard: FC<CardProps> = ({ ingredientInfo, highlighted }) => {
  // Showing price as unit preference
  const { currentUnits } = useUnitContext();

  const [{ updateIngredient }, ingredientLoading, error] = useIngredientHook();

  const { handleSubmit, control, setValue, getValues, resetField } =
    useFormContext<IngredientFormData>();

  const [newPrice, newMeasurement, newUnit, newQuantity] = useWatch({
    control,
    name: ['price', 'capacity', 'unit', 'quantity'],
  });

  // Check if text is overflowing
  const [overflowing, setOverflowing] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const { current } = textRef;
    if (current) {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      setOverflowing(hasOverflow);
    }
  }, []);

  // Modify form data for update submission
  const onUpdateTransform = useCallback(
    async (data: WithDocId<PersonalIngredient>): Promise<void> => {
      setValue('name', data.name);
      setValue('ingredientId', data.documentId);
    },
    [setValue],
  );

  const onUpdateSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      const currentIngredient: IngredientFormData = {
        ingredientId: data.ingredientId,
        name: data.name,
        price: getValues('price'),
        quantity: getValues('quantity'),
        capacity: getValues('capacity'),
        unit: getValues('unit'),
      };

      await updateIngredient(currentIngredient);

      resetField('price');
      resetField('quantity');
      resetField('unit');
      resetField('capacity');
    },
    [getValues, resetField, updateIngredient],
  );

  const newPricePerMeasurement = useMemo(
    () =>
      priceConverter(
        calcIndividualPrice(newPrice, newMeasurement, newQuantity),
        newUnit,
        currentUnits,
      ),
    [currentUnits, newMeasurement, newPrice, newQuantity, newUnit],
  );

  const currentPricePerMeasurement =
    useMemo(() => {
      if (ingredientInfo)
        return priceConverter(ingredientInfo.price, ingredientInfo?.unit, currentUnits);
    }, [ingredientInfo, currentUnits]) || NaN;

  const currentUnit = useMemo(() => {
    if (ingredientInfo) return unitConverter(ingredientInfo.unit, currentUnits);
  }, [currentUnits, ingredientInfo]);

  const delta = useMemo(() => {
    if (newPricePerMeasurement)
      return getPercentChange(currentPricePerMeasurement, newPricePerMeasurement);
  }, [currentPricePerMeasurement, newPricePerMeasurement]);

  return (
    <Card
      h="100%"
      boxShadow={highlighted ? 'under' : 'normal'}
      _hover={{ boxShadow: highlighted ? 'focus' : 'hover' }}
    >
      {/* Image */}
      <CardHeader>
        {/* TODO: image uploading */}
        <AbsoluteCenter w="100%">
          <Image src={'/media/foodPlaceholder.png'} alt={'Food placeholder'} />
        </AbsoluteCenter>
      </CardHeader>

      {/* Card line */}
      {/* <Divider boxShadow={'focus'} borderColor={'lightgrey'} /> */}

      {/* Info */}
      <CardBody
        onClick={async () => {
          await onUpdateTransform(ingredientInfo);
          handleSubmit(onUpdateSubmit)();
        }}
      >
        <Text overflow={'hidden'} bg={'white'} _dark={{ bg: 'gray.800' }}>
          {highlighted ? 'Update' : <span>&nbsp;</span>}
        </Text>

        <Tooltip isDisabled={!overflowing} hasArrow label={ingredientInfo?.name} placement={'top'}>
          <Text
            ref={textRef}
            as="b"
            color={'#0070f3'}
            whiteSpace={'nowrap'}
            display={'block'}
            isTruncated
          >
            {ingredientInfo?.name}
          </Text>
        </Tooltip>

        <Text display={'block'} overflow={'hidden'}>
          {ingredientInfo?.price ? currencyFormatter.format(currentPricePerMeasurement) : 'price'}/
          {ingredientInfo?.unit ? currentUnit : 'unit'}
        </Text>

        <Stat>
          {delta ? (
            <>
              <StatArrow type={delta > 0 ? 'increase' : 'decrease'} />
              {percentageFormatter.format(delta)}%
            </>
          ) : (
            <>&nbsp;</>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
};

// Search result cards
export const NewIngredientCard: FC = () => {
  // Showing price as unit preference
  const { currentUnits } = useUnitContext();

  const [{ submitIngredient }, ingredientLoading, error] = useIngredientHook();

  const { handleSubmit, control, reset } = useFormContext<IngredientFormData>();

  const [newName, newPrice, newQuantity, newUnit, newMeasurement] = useWatch({
    control,
    name: ['name', 'price', 'quantity', 'unit', 'capacity'],
  });

  // Check if text is overflowing
  const [overflowing, setOverflowing] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const { current } = textRef;
    if (current) {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      setOverflowing(hasOverflow);
    }
  }, []);

  // Reset form on successful submit
  const onSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      await submitIngredient(data);
      reset();
    },
    [reset, submitIngredient],
  );

  /* Preview new ingredient information: memoizing reduces rerenders/function calls
   * pricePerMeasurement: converted price per dropdown unit capacity per item
   * pricePerItem: converted price per item, ignoring measurement unit capacity
   * convertedUnit: converted dropdown unit to user's appropriate (mass, volume) current unit
   */
  /* Price example: $6.97 for box of 12 x 0.355L cans of Coke
   * Price: 6.97
   * Measurement: 0.355
   * Unit: L
   * Quantity: 12
   * Price per item: 6.97 / 12
   * Price per measurement per item: 6.97 / 0.355 / 12
   * ---
   * Price example: $7.50 for deal of 2 x 1.89L cartons of almond milk
   * Price per item: 7.5 / 2
   * Price per measurement per item: 7.5 / 1.89 / 2
   */
  const pricePerMeasurement = useMemo(
    () =>
      priceConverter(
        calcIndividualPrice(newPrice, newMeasurement, newQuantity),
        newUnit,
        currentUnits,
      ),
    [currentUnits, newMeasurement, newPrice, newQuantity, newUnit],
  );

  const pricePerItem = useMemo(
    () => priceConverter(calcIndividualPrice(newPrice, newQuantity), newUnit, currentUnits),
    [currentUnits, newPrice, newQuantity, newUnit],
  );

  const convertedUnit = useMemo(
    () => unitConverter(newUnit, currentUnits),
    [currentUnits, newUnit],
  );

  return (
    <Card h="100%">
      {/* Image */}
      <CardHeader>
        <AbsoluteCenter>
          {/* TODO: image uploading */}
          <Image src={'/media/imageUploadIcon.png'} alt={'Upload image'} borderRadius={'lg'} />
        </AbsoluteCenter>
      </CardHeader>

      {/* Card line */}
      {/* <Divider boxShadow={'focus'} borderColor={'lightgrey'} /> */}

      <CardBody onClick={handleSubmit(onSubmit)}>
        <Text as={'b'} overflow={'hidden'} bg={'white'} _dark={{ bg: 'gray.800' }}>
          Save
        </Text>

        <Tooltip
          isDisabled={!overflowing}
          hasArrow
          label={newName || 'ingredient'}
          placement={'top'}
        >
          <Text
            ref={textRef}
            as={'b'}
            display={'block'}
            color={'#0070f3'}
            whiteSpace={'nowrap'}
            isTruncated
          >
            {newName || 'ingredient'}
          </Text>
        </Tooltip>

        {/* price / unit */}
        <Text display={'block'} overflow={'hidden'}>
          {newPrice && newMeasurement ? currencyFormatter.format(pricePerMeasurement) : 'price'}/
          {newUnit ? convertedUnit : 'unit'}
        </Text>

        {/* Shows price / unit * measurement */}
        <Text display={'block'} overflow={'hidden'}>
          {pricePerItem ? currencyFormatter.format(pricePerItem) : ''}
          &nbsp;each
        </Text>
      </CardBody>
    </Card>
  );
};