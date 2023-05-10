import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import {
  useColorModeValue,
  Flex,
  AccordionButton,
  Grid,
  GridItem,
  Button,
  Heading,
  Badge,
  AccordionIcon,
  AccordionPanel,
  Show,
  CloseButton,
  Input,
  Select,
  IconButton,
  Box,
  Text,
} from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { GroceryListFormData } from '.';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';
import useGroceryListHook from '../../hooks/useGroceryListHook';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { useUnitContext } from '../../hooks/useUnitContext';
import { Unit } from '../../lib/firebase/interfaces';
import {
  totalPrice,
  priceConverter,
  priceCalculator,
  validateIsNumber,
  currencyFormatter,
} from '../../lib/textFormatters';
import { IngredientComboBox } from './listForm';

const NewListAccordion: FC<{
  isExpanded: boolean;
  groceryListsLength: number;
  newListName: string;
}> = ({ isExpanded, groceryListsLength, newListName }) => {
  const { authUser } = useAuthContext();
  const [{ submitGroceryList }, loading] = useGroceryListHook();
  const { setExpandedIndex, groceryListCreator } = useGroceryListContext();
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const { currentUnits } = useUnitContext();
  const {
    register,
    control,
    watch,
    handleSubmit,
    resetField,

    formState: { errors },
  } = useFormContext<GroceryListFormData>();

  const ingredients = watch('ingredients');

  const listPrice = ingredients.reduce<number>((price, { name, capacity, quantity }) => {
    const pricePerCapacity: number | undefined = ingredientIndexes[name]
      ? currentIngredients[ingredientIndexes[name]].price
      : undefined;

    const displayPrice: number | undefined = pricePerCapacity
      ? totalPrice(pricePerCapacity, capacity, quantity)
      : undefined;
    return displayPrice ? price + displayPrice : price;
  }, 0);

  const {
    fields: fieldIngredients,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const onSubmitHandler = useCallback(
    async (groceryListData: GroceryListFormData) => {
      await submitGroceryList(groceryListData);
      resetField('name');
      resetField('ingredients');
    },
    [resetField, submitGroceryList],
  );
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Flex h={{ base: '100%', sm: 'unset' }} flexDir={'column'}>
      <AccordionButton
        h={{ base: '100%', sm: 'unset' }}
        w={{ sm: '100%' }}
        bg={isExpanded ? 'lightcoral' : ''}
        // Base: 8px needed otherwise sets to 0 on mobile
        py={{ base: '8px', sm: '0px' }}
        as={Box}
        cursor={'pointer'}
        onClick={() => {
          setExpandedIndex(isExpanded ? [] : [0]);
        }}
        alignItems={'start'}
      >
        <Grid
          templateColumns={{ base: '1fr', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
          templateRows={{ base: '100px 1fr 1fr 1fr', sm: '1fr' }}
          w={'100%'}
          h={{ base: '350px', sm: 'unset' }}
          p={'12px 0px'}
          textAlign={{ base: 'center', sm: 'start' }}
          columnGap={'20px'}
          rowGap={'20px'}
        >
          <GridItem alignSelf={'center'}>
            <Button
              isLoading={loading}
              loadingText="Saving list"
              onClick={e => {
                // Prevent this button clicking from triggering accordion
                e.stopPropagation();
                handleSubmit(onSubmitHandler)();
              }}
              whiteSpace={'normal'}
              wordBreak={'break-word'}
              h={'fit-content'}
              bg={'white'}
              _dark={{ bg: 'gray.800' }}
              /**
               * @default minHeight: 10
               * @default paddingY: 2
               */
              minHeight={10}
              paddingY={2}
            >
              <Text>Save {newListName ? newListName : ' new list'}</Text>
            </Button>
          </GridItem>

          {authUser && !groceryListCreator && groceryListsLength === 0 ? (
            <Heading textAlign={'center'}>{'Create a new list'}</Heading>
          ) : (
            <Flex flexWrap={'wrap'} gap={'10px'} alignContent={{ sm: 'center' }}>
              {ingredients.map((field, index) => (
                <Box key={`ingredient_${index}`}>
                  <Badge>{field.name}</Badge>
                </Box>
              ))}
            </Flex>
          )}

          <GridItem
            alignSelf={'center'}
            textAlign={'center'}
            gridColumnStart={{ sm: 4 }}
            gridRowStart={{ base: '4', sm: 'unset' }}
          >
            <AccordionIcon />
          </GridItem>
        </Grid>
      </AccordionButton>

      {/* Group of inputs for customizing ingredients */}
      <AccordionPanel
        pos={{ base: 'absolute', sm: 'unset' }}
        top={{ base: '0', sm: 'unset' }}
        right={{ base: '0', sm: 'unset' }}
        h={{ base: '100%', sm: 'unset' }}
        w={{ base: '100%', sm: 'unset' }}
        bg={bg}
      >
        <Show below="sm">
          <CloseButton
            ml={'auto'}
            onClick={() => {
              setExpandedIndex([]);
            }}
          />
        </Show>
        {ingredients.map(({ name, capacity, quantity, unit }, index) => {
          const pricePerCapacity = ingredientIndexes[name]
            ? currentIngredients[ingredientIndexes[name]].price
            : undefined;

          const displayPrice = pricePerCapacity
            ? priceConverter(
                priceCalculator(pricePerCapacity, capacity, quantity),
                unit,
                currentUnits,
              )
            : undefined;
          return (
            <Grid
              templateColumns={{ base: '100%', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
              key={`newIngredient_${index}`}
              p={'12px 0px'}
              gap={'20px'}
            >
              <Grid
                gridColumn={{ sm: 2 }}
                templateColumns={{ base: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }}
                textAlign={'start'}
                gap={'20px'}
              >
                <IngredientComboBox ingredientFieldIndex={index} />

                <Input
                  type="number"
                  {...register(`ingredients.${index}.capacity`, {
                    valueAsNumber: true,
                    min: 0,
                    validate: capacity => {
                      if (capacity) return validateIsNumber(capacity);
                    },
                  })}
                  isInvalid={errors.ingredients?.[index]?.capacity?.type === 'validate'}
                  placeholder={'Capacity'}
                />

                <Select
                  {...register(`ingredients.${index}.unit`)}
                  color={unit ? 'black' : 'grey'}
                  placeholder={'Unit'}
                >
                  {Object.values(Unit).map((unit, index) => {
                    return (
                      <option key={`${unit}_${index}`} value={unit}>
                        {unit}
                      </option>
                    );
                  })}
                </Select>

                <Input
                  type="number"
                  {...register(`ingredients.${index}.quantity`, {
                    valueAsNumber: true,
                    min: 0,
                    validate: quantity => {
                      if (quantity) return validateIsNumber(quantity);
                    },
                  })}
                  placeholder={'Quantity'}
                />
              </Grid>

              <GridItem
                textAlign={{ sm: 'end' }}
                alignSelf={'center'}
                gridRow={{ base: '2', sm: '1' }}
                gridColumn={{ base: '1', sm: '3' }}
              >
                {displayPrice ? <Text>{currencyFormatter.format(displayPrice)}</Text> : null}
              </GridItem>

              <GridItem
                textAlign={'end'}
                gridRow={{ base: '2', sm: '1' }}
                gridColumn={{ base: '1', sm: '4' }}
              >
                <IconButton
                  aria-label="Remove ingredient"
                  icon={<DeleteIcon />}
                  onClick={() => removeIngredient(index)}
                />
              </GridItem>
            </Grid>
          );
        })}

        <Grid
          templateColumns={{ base: '100%', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
          p="12px 0px"
          gap={'20px'}
        >
          {!ingredients.length ? (
            <Heading textAlign={'center'} gridColumn={{ sm: '2/3' }}>
              Add some ingredients
            </Heading>
          ) : null}

          {listPrice ? (
            <GridItem
              textAlign={{ sm: 'end' }}
              alignSelf={'center'}
              gridRow={{ base: '2', sm: '1' }}
              gridColumn={{ base: '1', sm: '3' }}
            >
              <Text>{currencyFormatter.format(listPrice)}</Text>
            </GridItem>
          ) : null}

          <GridItem
            textAlign={'end'}
            gridRow={{ base: '2', sm: '1' }}
            gridColumn={{ base: '1', sm: '4' }}
          >
            <IconButton
              aria-label="Add ingredient"
              icon={<AddIcon />}
              onClick={() =>
                appendIngredient(
                  { name: '' },
                  {
                    // Currently manually disables all autoFocus, since input is shared
                    focusName: `ingredients.${fieldIngredients.length}.name`,
                  },
                )
              }
            />
          </GridItem>
        </Grid>
      </AccordionPanel>
    </Flex>
  );
};

export default NewListAccordion;
