import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  Image,
  Card,
  Divider,
  CardHeader,
  CardBody,
  StatArrow,
  Stat,
  Tooltip,
  AbsoluteCenter,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Ingredient } from '../../lib/firebase/interfaces';
import { IngredientFormData } from '../Dashboard';
import { useUnit } from '../../hooks/useUnit';
import {
  priceCalculator,
  currencyFormatter,
  getPercentChange,
  percentageFormatter,
  priceConverter,
  unitConverter,
} from '../../lib/textFormatters';

type CardProps = {
  ingredientInfo?: Ingredient;
  handleSubmit?: () => Promise<void>;
  highlighted?: boolean;
};

// TODO: hovering over existing cards should show detailed information
// Search result cards
export const IngredientCard: FC<CardProps> = ({ ingredientInfo, handleSubmit, highlighted }) => {
  // Showing price as unit preference
  const { currentUnits } = useUnit();

  const { control } = useFormContext<IngredientFormData>();

  const [newPrice, newAmount, newUnit] = useWatch({
    control,
    name: ['price', 'amount', 'unit'],
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

  const convertedNewPrice = useMemo(() => {
    return priceConverter(priceCalculator(newPrice, newAmount), newUnit, currentUnits);
  }, [currentUnits, newAmount, newPrice, newUnit]);

  const convertedExistingPrice =
    useMemo(() => {
      if (ingredientInfo)
        return priceConverter(
          priceCalculator(ingredientInfo.price, 1),
          ingredientInfo?.unit,
          currentUnits,
        );
    }, [ingredientInfo, currentUnits]) || 0;

  const convertedExistingUnit = useMemo(() => {
    if (ingredientInfo) return unitConverter(ingredientInfo.unit, currentUnits);
  }, [currentUnits, ingredientInfo]);

  const delta = useMemo(() => {
    if (convertedNewPrice) return getPercentChange(convertedExistingPrice, convertedNewPrice);
  }, [convertedExistingPrice, convertedNewPrice]);

  return (
    <Card
      ml={{ base: '30px', sm: 'unset' }}
      letterSpacing={'2px'}
      scrollSnapAlign={'center'}
      borderRadius={'5px'}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={highlighted ? 'under' : 'normal'}
      _hover={{ boxShadow: highlighted ? 'focus' : 'hover' }}
    >
      {/* Image */}
      <CardHeader height={'180px'} position={'relative'}>
        {/* TODO: image uploading */}
        <AbsoluteCenter w="100%">
          <Image src={'/media/foodPlaceholder.png'} alt={'Food placeholder'} />
        </AbsoluteCenter>
      </CardHeader>

      {/* Card line */}
      <Divider boxShadow={'focus'} borderColor={'lightgrey'} />

      {/* Info */}
      <CardBody
        onClick={handleSubmit}
        h={'100%'}
        w={'100%'}
        padding={'15px 30px'}
        cursor={'pointer'}
        textAlign={'center'}
      >
        <Text display={'block'}>Update</Text>

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
          {ingredientInfo?.price ? currencyFormatter.format(convertedExistingPrice) : 'price'}/
          {ingredientInfo?.unit ? convertedExistingUnit : 'unit'}
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
export const NewIngredientCard: FC<CardProps> = ({ handleSubmit }) => {
  // Showing price as unit preference
  const { currentUnits } = useUnit();

  const { control } = useFormContext<IngredientFormData>();

  const [newName, newPrice, newQuantity, newUnit, newAmount] = useWatch({
    control,
    name: ['name', 'price', 'quantity', 'unit', 'amount'],
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

  /* Preview new ingredient information: memoizing reduces rerenders/function calls
   * previewPrice: converting price/quantity cents to dollar (100 -> $1.00)
   * convertedPreviewPrice: converted dropdown unit's price to user's current unit price
   * convertedUnit: converted dropdown unit to user's appropriate (mass, volume) current unit
   */
  const previewPrice = useMemo(
    () => priceCalculator(newPrice, newQuantity),
    [newPrice, newQuantity],
  );

  const convertedPreviewPrice = useMemo(
    () => priceConverter(priceCalculator(previewPrice, newAmount), newUnit, currentUnits),
    [currentUnits, newAmount, newUnit, previewPrice],
  );

  const convertedUnit = useMemo(
    () => unitConverter(newUnit, currentUnits),
    [currentUnits, newUnit],
  );

  return (
    <Card
      // bg="darkcyan"
      ml={{ base: '30px', sm: 'unset' }}
      letterSpacing={'2px'}
      borderRadius={'5px'}
      scrollSnapAlign={'center'}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={{ sm: 'normal' }}
      _hover={{ boxShadow: 'focus' }}
    >
      {/* Image */}
      <CardHeader height={'180px'} position={'relative'}>
        <AbsoluteCenter>
          {/* TODO: image uploading */}
          <Image src={'/media/imageUploadIcon.png'} alt={'Upload image'} borderRadius={'lg'} />
        </AbsoluteCenter>
      </CardHeader>

      {/* Card line */}
      <Divider boxShadow={'focus'} borderColor={'lightgrey'} />

      <CardBody
        onClick={handleSubmit}
        h={'100%'}
        w={'100%'}
        padding={'15px 30px'}
        cursor={'pointer'}
        textAlign={'center'}
      >
        <Text display={'block'} overflow={'hidden'}>
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
          {newPrice && newAmount ? currencyFormatter.format(convertedPreviewPrice) : 'price'}/
          {newUnit ? convertedUnit : 'unit'}
        </Text>

        {/* Shows price / unit * amount */}
        <Text display={'block'} overflow={'hidden'}>
          {previewPrice ? currencyFormatter.format(previewPrice) : ''}
          &nbsp;each
        </Text>
      </CardBody>
    </Card>
  );
};
