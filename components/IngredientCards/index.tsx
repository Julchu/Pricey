import { Dispatch, SetStateAction, FC, useCallback } from 'react';
import Image from 'next/image';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useUnit } from '../../contexts/UnitContext';
import { IngredientInfo, Unit } from '../../lib/firebase/interfaces';
import {
  isMass,
  isArea,
  priceConverter,
  currencyFormatter,
  unitFormatter,
} from '../../lib/textFormatters';
import { IngredientFormData } from '../IngredientList';

type CardProps = {
  ingredientInfo?: IngredientInfo;
  handleSubmit?: () => Promise<void>;
  newIngredient?: IngredientFormData;
  setNewIngredient?: Dispatch<SetStateAction<IngredientFormData>>;
};

// TODO: hovering over existing cards should show detailed information
// Search result cards
export const IngredientCard: FC<CardProps> = ({
  ingredientInfo,
  handleSubmit,
  newIngredient,
  setNewIngredient,
}) => {
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
      // setValue('unit', ingredientInfo.unit);

      await handleSubmit();

      if (Object.keys(errors).length === 0) {
        setNewIngredient({ ...newIngredient, name: ingredientInfo.name, unit: '' as Unit });

        resetField('price');
        resetField('quantity');
      }
    }
  }, [errors, handleSubmit, ingredientInfo, newIngredient, resetField, setNewIngredient, setValue]);

  return (
    <Box
      letterSpacing={'2px'}
      fontSize={'16px'}
      scrollSnapAlign={'center'}
      border={{ base: '1px solid grey', sm: 'none' }}
      borderRadius={'5px'}
      outline={{ sm: 'none' }}
      h={{ sm: '300px' }}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={highlighted ? 'under' : 'normal'}
      _hover={{ boxShadow: highlighted ? 'focus' : 'hover' }}
    >
      {/* Image */}
      <Flex minHeight={'180px'}>
        <Box margin={'auto'}>
          {/* TODO: image uploading */}
          {/* TODO: wrap NextJS Image with ChakraImage, currently using NextJS Image only
            https://www.jamesperkins.dev/post/using-next-image-with-chakra/
           */}
          <Image
            src={'media/foodPlaceholder.png'}
            alt={'Food placeholder'}
            width={'300px'}
            height={'200px'}
          />
        </Box>
      </Flex>

      {/* Card line */}
      <Box borderTop={'1px solid lightgrey'} boxShadow={'focus'} />

      {/* Info */}
      <Box onClick={onClickHandler} h={'100%'} w={'100%'} padding={'15px 30px'} cursor={'pointer'}>
        <Text
          as="b"
          color={'#0070f3'}
          whiteSpace={'nowrap'}
          display={'block'}
          textAlign={'center'}
          overflow={'hidden'}
        >
          {ingredientInfo?.name}
        </Text>

        <Text display={'block'} textAlign={'center'} overflow={'hidden'}>
          Avg: {currencyFormatter.format(averagePrice / 100)}/{unitFormatter(convertedUnit)}
        </Text>

        <Text display={'block'} textAlign={'center'} overflow={'hidden'}>
          Low: {currencyFormatter.format(convertedLowest / 100)}/{unitFormatter(convertedUnit)}
        </Text>
      </Box>
    </Box>
  );
};

// Search result cards
export const NewIngredientCard: FC<CardProps> = ({
  handleSubmit,
  newIngredient,
  setNewIngredient,
}) => {
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
        setNewIngredient({ ...newIngredient, name: newIngredient.name, unit: '' as Unit });

        resetField('price');
        resetField('quantity');
      }
    }
  }, [errors, handleSubmit, newIngredient, resetField, setNewIngredient, setValue]);

  return (
    <Box
      ml={'30px'}
      letterSpacing={'2px'}
      fontSize={'16px'}
      scrollSnapAlign={'center'}
      border={{ base: '1px solid grey', sm: 'none' }}
      borderRadius={'5px'}
      outline={{ sm: 'none' }}
      h={{ sm: '300px' }}
      w={{ base: 'calc(100vw - 60px)', sm: '250px' }}
      transition={{ sm: 'box-shadow 0.2s ease-in-out' }}
      boxShadow={'normal'}
      _hover={{ boxShadow: 'hover' }}
    >
      {/* Image */}
      <Flex minHeight={'180px'}>
        <Box margin={'auto'}>
          {/* TODO: image uploading */}
          {/* TODO: wrap NextJS Image with ChakraImage, currently using NextJS Image only
            https://www.jamesperkins.dev/post/using-next-image-with-chakra/
           */}
          <Image
            src={'media/imageUploadIcon.png'}
            alt={'Upload image'}
            width={'150px'}
            height={'100px'}
          />
        </Box>
      </Flex>

      {/* Cardline */}
      <Box borderTop={'1px solid lightgrey'} boxShadow={'focus'} />

      {/* Info */}
      <Box onClick={onClickHandler} h={'100%'} w={'100%'} padding={'15px 30px'} cursor={'pointer'}>
        <Text display={'block'} textAlign={'center'} overflow={'hidden'}>
          Save
        </Text>

        <Text as={'b'} display={'block'} textAlign={'center'} overflow={'hidden'} color={'#0070f3'}>
          {newIngredient?.name || 'an ingredient'}
        </Text>

        {/* TODO: add preview pricing */}
        {newIngredient && newIngredient.price && newIngredient.quantity && newIngredient.unit ? (
          <Text display={'block'} textAlign={'center'} overflow={'hidden'}>
            {currencyFormatter.format(convertedPreviewPrice)}/{unitFormatter(convertedUnit)}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
};
