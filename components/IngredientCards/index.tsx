import { Dispatch, SetStateAction, FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  Card,
  Divider,
  CardHeader,
  CardBody,
  Heading,
  StatArrow,
  Stat,
  StatHelpText,
} from '@chakra-ui/react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Ingredient, Unit } from '../../lib/firebase/interfaces';
import {
  isMass,
  isVolume,
  priceConverter,
  currencyFormatter,
  unitFormatter,
} from '../../lib/textFormatters';
import { IngredientFormData } from '../Dashboard';
import { useUnit } from '../../hooks/useUnit';

type CardProps = {
  ingredientInfo?: Ingredient;
  handleSubmit?: () => Promise<void>;
  highlighted?: boolean;
};

// TODO: hovering over existing cards should show detailed information
// Search result cards
export const IngredientCard: FC<CardProps> = ({ ingredientInfo, handleSubmit, highlighted }) => {
  const { watch } = useFormContext<IngredientFormData>();

  // Showing price as unit preference
  const { currentUnits, convertToCurrent } = useUnit();

  const ingredientUnit = currentUnits;

  // Preview new ingredient information
  const previewPrice = ingredientInfo ? ingredientInfo.price / 100 : 0;
  const convertedPreviewPrice = ingredientInfo
    ? convertToCurrent(previewPrice, ingredientInfo.unit)
    : 0;

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
          <StatArrow type="increase" />
          Cheese
        </Stat>

        <Text as="b" color={'#0070f3'} whiteSpace={'nowrap'} display={'block'} overflow={'hidden'}>
          {ingredientInfo?.name}
        </Text>

        <Text display={'block'} overflow={'hidden'}>
          {ingredientInfo?.price ? currencyFormatter.format(convertedPreviewPrice) : 'price'}/
          {ingredientInfo?.unit ? ingredientUnit : 'unit'}
        </Text>
      </CardBody>
    </Card>
  );
};

// Search result cards
export const NewIngredientCard: FC<CardProps> = ({ handleSubmit }) => {
  // Showing price as unit preference
  const { currentUnits, convertToCurrent } = useUnit();

  const { watch } = useFormContext<IngredientFormData>();
  const newIngredient = watch();

  // Preview new ingredient information
  const previewPrice = newIngredient
    ? (newIngredient.price * 100) / newIngredient.quantity / 100
    : 0;

  const [convertedPreviewPrice, convertedUnit] = convertToCurrent(previewPrice, newIngredient.unit);
  console.log(convertedUnit);

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
        <Text display={'block'} overflow={'hidden'}>
          Save
        </Text>

        <Text as={'b'} display={'block'} overflow={'hidden'} color={'#0070f3'}>
          {newIngredient.name || 'ingredient'}
        </Text>

        {/* Shows price / unit */}
        <Text display={'block'} overflow={'hidden'}>
          {newIngredient?.price && newIngredient?.quantity
            ? currencyFormatter.format(convertedPreviewPrice)
            : 'price'}
          /{newIngredient?.unit ? unitFormatter(convertedUnit) : 'unit'}
        </Text>
      </CardBody>
    </Card>
  );
};
