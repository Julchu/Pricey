import {
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Badge,
  Box,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Select,
  Show,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { GroceryList, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { calcTotalPrice, currencyFormatter, validateIsNumber } from '../../lib/textFormatters';
import { AddIcon, CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { GroceryListFormData, GroceryListFormIngredient } from './index';
import useGroceryListHook from '../../hooks/useGroceryListHook';
import { IngredientComboBox } from './listForm';

const CurrentListAccordion: FC<{
  isExpanded: boolean;
  index: number;
  list: WithDocId<GroceryList>;
}> = ({ isExpanded, index, list }) => {
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const [{ updateGroceryList, deleteGroceryList }, loading] = useGroceryListHook();
  const { setExpandedIndex } = useGroceryListContext();
  const bg = useColorModeValue('white', 'gray.800');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const methods = useForm<GroceryListFormData>({
    defaultValues: { ...list, groceryListId: list.documentId } || {
      name: '',
      ingredients: [],
      viewable: false,
    },
  });

  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset({ ...list, groceryListId: list.documentId });
  }, [isEditing, list, reset]);

  const ingredients = watch('ingredients');
  const { append: appendIngredient, remove: removeIngredient } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const onUpdateHandler = useCallback(
    async (groceryListData: GroceryListFormData) => {
      await updateGroceryList(groceryListData);
    },
    [updateGroceryList],
  );

  const onDeleteHandler = useCallback(
    async (groceryListData: GroceryListFormData) => {
      if (groceryListData.groceryListId) await deleteGroceryList(groceryListData.groceryListId);
      setIsEditing(false);
    },
    [deleteGroceryList],
  );

  /**
   * @property prices: { ingredient name, capacity, unit, quantity } and price: converted price * capacity * quantity // ingredient info
   * @property totalPrice: combined total price of all ingredients
   * */
  const listPrice = list.ingredients.reduce<{
    listIngredients: ({
      name: string;
      capacity: number | undefined;
      unit: Unit | undefined;
      quantity: number | undefined;
    } & { price: number | undefined })[];
    totalPrice: number;
  }>(
    (acc, { name, capacity, unit, quantity }) => {
      const pricePerCapacity =
        ingredientIndexes[name] >= 0
          ? currentIngredients[ingredientIndexes[name]].price
          : undefined;

      const displayPrice = pricePerCapacity
        ? calcTotalPrice(pricePerCapacity, capacity, quantity)
        : undefined;

      acc.listIngredients.push({ name, capacity, unit, quantity, price: displayPrice });

      return displayPrice
        ? { listIngredients: acc.listIngredients, totalPrice: acc.totalPrice + displayPrice }
        : { listIngredients: acc.listIngredients, totalPrice: acc.totalPrice };
    },
    { listIngredients: [], totalPrice: 0 },
  );

  return (
    <FormProvider {...methods}>
      <Flex h={{ base: '100%', sm: 'unset' }} flexDir={'column'}>
        <AccordionButton
          as={Box}
          cursor={'pointer'}
          h={{ base: '100%', sm: 'unset' }}
          bg={isExpanded ? 'lightcoral' : ''}
          onClick={() => {
            // Checking if current AccordionItem is the current one
            setExpandedIndex(isExpanded ? [] : [index]);
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
            {/* Grocery list name */}
            {isEditing ? (
              <Input onClick={e => e.stopPropagation()} {...register('name', { required: true })} />
            ) : (
              <Text as={'b'} display={'block'} alignSelf={'center'}>
                {list.name}
              </Text>
            )}

            {/* Ingredient badges */}
            <Flex flexWrap={'wrap'} gap={'10px'} alignContent={{ sm: 'center' }}>
              {isEditing
                ? ingredients.map((ingredient, index) => {
                    return (
                      <Box key={`ingredient_${index}`}>
                        <Badge>{ingredient.name}</Badge>
                      </Box>
                    );
                  })
                : listPrice.listIngredients.map((ingredient, index) => {
                    return (
                      <Box key={`ingredient_${index}`}>
                        <Badge>{ingredient.name}</Badge>
                      </Box>
                    );
                  })}
            </Flex>

            {/* Price */}
            {listPrice.totalPrice ? (
              <Text textAlign={'end'}>{currencyFormatter.format(listPrice.totalPrice)}</Text>
            ) : null}

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

        <AccordionPanel
          pos={{ base: 'absolute', sm: 'unset' }}
          top={{ base: '0', sm: 'unset' }}
          right={{ base: '0', sm: 'unset' }}
          h={{ base: '100%', sm: 'unset' }}
          w={'100%'}
          bg={bg}
        >
          <Show below={'sm'}>
            <CloseButton
              ml={'auto'}
              onClick={() => {
                setExpandedIndex([]);
              }}
            />
          </Show>

          {ingredients.length ? (
            <Show above={'sm'}>
              {/* "Table" header for existing ingredient info */}
              <Grid templateColumns={'1.5fr 4.5fr 1fr 0.3fr'} columnGap={'20px'} my={'10px'}>
                <GridItem gridColumnStart={'2'} gridColumnEnd={'4'}>
                  <Grid templateColumns={'1fr 1fr 1fr 1fr 1fr'} columnGap={'20px'}>
                    <Text as={'b'}>Ingredient name</Text>
                    <Text as={'b'} textAlign={'end'}>
                      Measurement
                    </Text>
                    <Text as={'b'} textAlign={'end'}>
                      Unit
                    </Text>
                    <Text as={'b'} textAlign={'end'}>
                      Quantity
                    </Text>
                    <Text as={'b'} textAlign={'end'}>
                      Estimated price
                    </Text>
                  </Grid>
                </GridItem>
              </Grid>
            </Show>
          ) : null}

          {/** Ingredient info list "table"
           * if isEditing: show grocery list Form for 'ingredients' for re-rendered ingredient lists (remove, append)
           * else: show static grocery list with prices
           */}
          {isEditing
            ? ingredients.map((_, index) => {
                return (
                  <IngredientForm
                    key={`editCurrentIngredient_${index}`}
                    index={index}
                    removeIngredient={removeIngredient}
                  />
                );
              })
            : listPrice.listIngredients.map(({ name, capacity, unit, quantity, price }, index) => {
                return (
                  <Grid
                    key={`expandedIngredient_${index}`}
                    templateColumns={{ base: '100%', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
                    p={'12px 0px'}
                    gap={'20px'}
                    my={'10px'}
                  >
                    <GridItem gridColumnStart={{ sm: '2' }} gridColumnEnd={{ sm: '4' }}>
                      <Grid templateColumns={'1fr 1fr 1fr 1fr 1fr'} columnGap={'20px'}>
                        <Text>{name ? name : '-'}</Text>
                        <Text textAlign={'end'}>{capacity ? capacity : '-'}</Text>
                        <Text textAlign={'end'}>{unit ? unit : '-'}</Text>
                        <Text textAlign={'end'}>{quantity ? quantity : '-'}</Text>
                        <Text textAlign={'end'}>
                          {price ? currencyFormatter.format(price) : '-'}
                        </Text>
                      </Grid>
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
              <Heading
                textAlign={'center'}
                gridRow={{ base: '1' }}
                gridColumn={{ base: '2/3', sm: '2/3' }}
              >
                Add some ingredients
              </Heading>
            ) : null}

            {/* Add ingredient button */}
            {isEditing ? (
              <GridItem
                textAlign={'end'}
                gridRow={{ base: '1', sm: '1' }}
                gridColumn={{ base: '1', sm: '4' }}
              >
                <IconButton
                  aria-label="Add ingredient"
                  icon={<AddIcon />}
                  onClick={() => {
                    appendIngredient(
                      { name: '' },
                      {
                        // Currently manually disables all autoFocus, since input is shared
                        focusName: `ingredients.${list.ingredients.length - 1}.name`,
                      },
                    );
                  }}
                />
              </GridItem>
            ) : null}

            {/* Delete list button */}
            {isEditing ? (
              <GridItem
                textAlign={{ base: 'start', sm: 'end' }}
                gridRow={{ base: '2', sm: '2' }}
                gridColumn={{ base: '1', sm: '3' }}
              >
                <IconButton
                  aria-label="Delete list"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    handleSubmit(onDeleteHandler)();
                  }}
                />
              </GridItem>
            ) : null}

            {/* Edit list button */}
            <GridItem
              textAlign={'end'}
              gridRow={{ base: '2', sm: '2' }}
              gridColumn={{ base: '1', sm: '4' }}
            >
              {isEditing ? (
                <>
                  <IconButton
                    aria-label="Edit grocery list"
                    icon={<CheckIcon />}
                    onClick={() => {
                      handleSubmit(onUpdateHandler)();
                      setIsEditing(false);
                    }}
                  />
                </>
              ) : (
                <IconButton
                  aria-label="Edit grocery list"
                  icon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                />
              )}
            </GridItem>
          </Grid>
        </AccordionPanel>
      </Flex>
    </FormProvider>
  );
};

const IngredientForm: FC<{
  index: number;
  removeIngredient: (index?: number | number[]) => void;
}> = ({ index, removeIngredient }) => {
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<GroceryListFormData>();

  const valueSetter = useCallback(
    (ingredientIndex: number, upgradedIngredient: GroceryListFormIngredient) => {
      setValue(`ingredients.${ingredientIndex}`, upgradedIngredient);
    },
    [setValue],
  );

  const [unit, ingredient] = useWatch({ name: ['inputName', `ingredients.${index}`] });

  const pricePerCapacity =
    ingredientIndexes[ingredient.name] >= 0
      ? currentIngredients[ingredientIndexes[ingredient.name]].price
      : undefined;

  const displayPrice = pricePerCapacity
    ? calcTotalPrice(pricePerCapacity, ingredient.capacity, ingredient.quantity)
    : undefined;

  return (
    <Grid
      templateColumns={{ base: '100%', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
      key={`newIngredient_${index}`}
      p={'12px 0px'}
      gap={'20px'}
    >
      <GridItem gridColumn={{ sm: 2 }}>
        <Grid
          templateColumns={{ base: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }}
          textAlign={'start'}
          gap={'20px'}
        >
          <IngredientComboBox
            ingredientName={ingredient.name}
            ingredientIndex={index}
            valueSetter={valueSetter}
          />

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
      </GridItem>

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
};

export default CurrentListAccordion;