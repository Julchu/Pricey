import { FC, useCallback, useMemo } from 'react';
import {
  Text,
  Image,
  Card,
  Divider,
  CardHeader,
  CardBody,
  StatArrow,
  Stat,
  Flex,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Ingredient } from '../../lib/firebase/interfaces';
import { IngredientFormData } from '../Dashboard';
import { useUnit } from '../../hooks/useUnit';
import {
  currencyFormatter,
  getPercentChange,
  percentageFormatter,
  priceCalculator,
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

  const { control, setValue, resetField } = useFormContext<IngredientFormData>();

  const [newPrice, newQuantity, newUnit] = useWatch({
    control,
    name: ['price', 'quantity', 'unit'],
  });

  // const previewNewPrice = useMemo(() => {
  //   if (name === ingredientInfo?.name) return (newPrice * 100) / newQuantity / 100;
  // }, [ingredientInfo?.name, name, newPrice, newQuantity]);

  const convertedNewPrice = useMemo(() => {
    return priceConverter(priceCalculator(newPrice, newQuantity), newUnit, currentUnits);
  }, [currentUnits, newPrice, newQuantity, newUnit]);

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
      border={{ base: '1px solid grey', sm: 'none' }}
      borderRadius={'5px'}
      // h={{ sm: '300px' }}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={highlighted ? 'under' : 'normal'}
      _hover={{ boxShadow: highlighted ? 'focus' : 'hover' }}
    >
      {/* Image */}
      <CardHeader height={'180px'}>
        {/* TODO: image uploading */}
        <Image src={'/media/foodPlaceholder.png'} alt={'Food placeholder'} />
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

        <Text as="b" color={'#0070f3'} whiteSpace={'nowrap'} display={'block'} overflow={'hidden'}>
          {ingredientInfo?.name}
        </Text>

        <Text display={'block'} overflow={'hidden'}>
          {ingredientInfo?.price ? currencyFormatter.format(convertedExistingPrice) : 'price'}/
          {ingredientInfo?.unit ? convertedExistingUnit : 'unit'}
        </Text>
      </CardBody>
    </Card>
  );
};

// Search result cards
export const NewIngredientCard: FC<CardProps> = ({ handleSubmit }) => {
  // Showing price as unit preference
  const { currentUnits } = useUnit();

  const { control } = useFormContext<IngredientFormData>();

  const [newName, newPrice, newQuantity, newUnit] = useWatch({
    control,
    name: ['name', 'price', 'quantity', 'unit'],
  });

  /* Preview new ingredient information: memoizing reduces rerenders/function calls
   * previewPrice: converting price/quantity cents to dollar (100 -> $1.00)
   * convertedPreviewPrice: converted dropdown unit's price to user's current unit price
   * convertedUnit: converted dropdown unit to user's appropriate (mass, volume) current unit
   */
  const previewPrice = useMemo(() => (newPrice * 100) / newQuantity / 100, [newPrice, newQuantity]);
  const convertedPreviewPrice = useMemo(
    () => priceConverter(previewPrice, newUnit, currentUnits),
    [currentUnits, newUnit, previewPrice],
  );
  const convertedUnit = useMemo(
    () => unitConverter(newUnit, currentUnits),
    [currentUnits, newUnit],
  );

  return (
    <Card
      ml={{ base: '30px', sm: 'unset' }}
      letterSpacing={'2px'}
      scrollSnapAlign={'center'}
      border={{ base: '1px solid grey', sm: 'none' }}
      borderRadius={'5px'}
      // h={{ sm: '300px' }}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={'normal'}
      _hover={{ boxShadow: 'hover' }}
    >
      {/* Image */}
      <CardHeader height={'180px'}>
        {/* TODO: image uploading */}
        <Image src={'/media/imageUploadIcon.png'} alt={'Upload image'} borderRadius="lg" />
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
        <Flex direction={'row'}>
          <Text display={'block'} overflow={'hidden'}>
            Save
          </Text>

          <Text as={'b'} display={'block'} overflow={'hidden'} color={'#0070f3'}>
            {newName || 'ingredient'}
          </Text>
        </Flex>

        {/* Shows price / unit */}
        <Text display={'block'} overflow={'hidden'}>
          {newPrice && newQuantity ? currencyFormatter.format(convertedPreviewPrice) : 'price'}/
          {newUnit ? convertedUnit : 'unit'}
        </Text>
      </CardBody>
    </Card>
  );
};
