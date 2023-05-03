import {
  Button,
  Box,
  Flex,
  Heading,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridItem,
  Text,
  Badge,
  Input,
  IconButton,
  useMediaQuery,
  Select,
  Hide,
  useColorModeValue,
  CloseButton,
} from '@chakra-ui/react';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { db, GroceryList, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import useGroceryListHook from '../../hooks/useGroceryListHook';
import Fuse from 'fuse.js';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { validateIsNumber } from '../../lib/textFormatters';
import ListForm from './listForm';

export type GroceryListFormData = {
  groceryListId?: string;
  name: string;
  ingredients: { name: string; price?: number; amount?: number; unit?: Unit; quantity?: number }[];
  viewable?: boolean;
};

/**
 * @param groceryListCreator: URL parameter
 * @purpose Firestore query to fetch grocery lists
 * * if no groceryListCreator, logged in user's docId
 * * else groceryListCreator as preferences.displayName or groceryListCreator as docId
 */
const GroceryLists: FC<{ groceryListCreator?: string }> = ({ groceryListCreator }) => {
  const { authUser } = useAuthContext();
  const [{ submitGroceryList }, loading] = useGroceryListHook();
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);

  const methods = useForm<GroceryListFormData>({
    defaultValues: {
      name: '',
      ingredients: [],
      viewable: false,
    },
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [newListName, ingredients] = watch(['name', 'ingredients']);

  const { append: appendIngredient, remove: removeIngredient } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const onSubmitHandler = useCallback(
    async (groceryListData: GroceryListFormData) => {
      console.log(groceryListData);
      // await submitGroceryList(groceryListData);
    },
    [
      /* submitGroceryList */
    ],
  );

  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const [isDesktopView] = useMediaQuery('(min-width: 30em)');

  useEffect(() => {
    const q = query(
      db.groceryListCollection,
      where('userId', '==', groceryListCreator ? groceryListCreator : authUser?.documentId),
    );

    onSnapshot(q, querySnapshot => {
      const queryListResults: WithDocId<GroceryList>[] = [];
      querySnapshot.forEach(doc => {
        queryListResults.push({ ...doc.data(), documentId: doc.id });
      });

      setGroceryLists(queryListResults);
    });
  }, [authUser?.documentId, groceryListCreator]);

  // Search grocery lists
  const filteredLists = useMemo(() => {
    const fuse = new Fuse(groceryLists, {
      keys: ['name', 'ingredients.name'],
      ignoreLocation: true,
    });

    const results = fuse.search(newListName || '');

    return newListName
      ? results.map(result => {
          return result.item;
        })
      : groceryLists;
  }, [newListName, groceryLists]);

  const bg = useColorModeValue('white', 'gray.800');

  return (
    <form>
      <FormProvider {...methods}>
        <Flex h="calc(100svh - 80px)" flexDir={'column'} display={{ base: 'flex', sm: 'block' }}>
          {/* Header inputs */}
          <Flex
            flexDir={{ base: 'column', sm: 'row' }}
            // display={{
            //   base: expandedIndex.length && expandedIndex[0] > -1 ? 'none' : 'flex',
            //   sm: 'flex',
            // }}
          >
            <ListForm />
          </Flex>

          {/* "Table" */}
          <Flex mt={'header'} flexDir={'column'} flexGrow={{ base: 1, sm: 'unset' }}>
            {/* "Table" Header */}
            <Hide below="md">
              <Grid
                templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                w={'100%'}
                p={'12px 30px'}
                columnGap={'20px'}
                textTransform={'uppercase'}
              >
                <Text as={'b'} textTransform={'uppercase'} textAlign={'start'}>
                  Name
                </Text>
                <Text as={'b'} textTransform={'uppercase'} textAlign={'start'}>
                  Ingredients
                </Text>
                <Text as={'b'} textTransform={'uppercase'} textAlign={'end'}>
                  Price
                </Text>
              </Grid>
            </Hide>

            {/* "Table" content */}
            <Accordion
              as={Grid}
              index={expandedIndex}
              variant={{ base: 'mobileCard', sm: 'defaultVariant' }}
              flexGrow={{ base: 1, sm: 'unset' }}
              p={{ base: '30px 0px', sm: '0px 30px' }}
            >
              {filteredLists.map((list, index) => {
                return (
                  <AccordionItem
                    key={`list_${index}`}
                    isFocusable={false}
                    scrollSnapAlign={'center'}
                  >
                    {({ isExpanded }) => (
                      <Flex h={{ base: '100%', sm: 'unset' }} flexDir={'column'}>
                        <AccordionButton
                          h={{ base: '100%', sm: 'unset' }}
                          w={{ sm: '100%' }}
                          bg={isExpanded ? 'coral' : ''}
                          onClick={() => {
                            setExpandedIndex(previousArray => {
                              if (previousArray.length && previousArray[0] === index) return [];
                              else return [index];
                            });
                          }}
                        >
                          <Grid
                            templateColumns={{ base: '1fr', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
                            templateRows={{ base: 'auto 1fr 1fr 1fr', sm: '1fr' }}
                            w={'100%'}
                            h={{ base: '350px', sm: 'unset' }}
                            p={'12px 0px'}
                            textAlign={{ base: 'center', sm: 'start' }}
                            columnGap={'20px'}
                            rowGap={'20px'}
                          >
                            {/* Grocery list name */}
                            <Text as={'b'} display={'block'} whiteSpace={'nowrap'} isTruncated>
                              {list.name}
                            </Text>

                            {/* Ingredient badges */}
                            <Flex flexWrap={'wrap'} gap={'10px'}>
                              {list.ingredients.map((ingredient, index) => {
                                return (
                                  <Box key={`ingredient_${index}`}>
                                    <Badge>{ingredient.name}</Badge>
                                  </Box>
                                );
                              })}
                            </Flex>

                            {/* Price */}
                            <Text textAlign={'end'}>$24</Text>

                            <GridItem textAlign={'center'}>
                              <AccordionIcon />
                            </GridItem>
                          </Grid>
                        </AccordionButton>

                        <AccordionPanel
                          pos={{ base: expandedIndex.length ? 'absolute' : 'unset', sm: 'unset' }}
                          top={{ base: expandedIndex.length ? '0' : 'unset', sm: 'unset' }}
                          right={{ base: expandedIndex.length ? '0' : 'unset', sm: 'unset' }}
                          h={{ base: expandedIndex.length ? '100%' : 'unset', sm: 'unset' }}
                          w={{ base: expandedIndex.length ? '100%' : 'unset', sm: 'unset' }}
                          bg={'bg'}
                          zIndex={99}
                        >
                          <CloseButton
                            ml={'auto'}
                            onClick={() => {
                              setExpandedIndex([]);
                            }}
                          />
                          <Grid templateColumns={'1.5fr 4.5fr 1fr 0.3fr'} columnGap={'20px'}>
                            <GridItem gridColumnStart={2}>
                              {list.ingredients.map(({ name, amount, unit, quantity }, index) => {
                                // TODO: multiply existing price by quantity/amount
                                const price = ingredientIndexes[name]
                                  ? currentIngredients[ingredientIndexes[name]].price
                                  : undefined;
                                return (
                                  <Grid
                                    templateColumns={'1fr 1fr 1fr 1fr 1fr'}
                                    columnGap={'20px'}
                                    key={`expandedIngredient_${index}`}
                                  >
                                    {name ? <Text>{name}</Text> : <Box />}
                                    {amount ? <Text>{amount}</Text> : <Box />}
                                    {unit ? <Text>{unit}</Text> : <Box />}
                                    {quantity ? <Text>{quantity}</Text> : <Box />}
                                    {price ? <Text>{price}</Text> : <Box />}
                                  </Grid>
                                );
                              })}
                            </GridItem>
                          </Grid>
                        </AccordionPanel>
                      </Flex>
                    )}
                  </AccordionItem>
                );
              })}

              {/* Start new list */}
              {/* Accordion button row */}
              {authUser && !groceryListCreator ? (
                <AccordionItem
                  isFocusable={false}
                  scrollSnapAlign={'center'}
                  mr={{ base: '30px', sm: 'unset' }}
                >
                  {({ isExpanded }) => (
                    <Flex h={{ base: '100%', sm: 'unset' }} flexDir={'column'}>
                      <AccordionButton
                        h={{ base: '100%', sm: 'unset' }}
                        w={{ sm: '100%' }}
                        bg={isExpanded ? 'coral' : ''}
                        py={0}
                        as={Box}
                        cursor={'pointer'}
                        onClick={() => {
                          setExpandedIndex(previousArray => {
                            if (previousArray.length && previousArray[0] === filteredLists.length)
                              return [];
                            else return [filteredLists.length];
                          });
                        }}
                      >
                        <Grid
                          templateColumns={{ base: '1fr', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
                          templateRows={{ base: 'auto 1fr 1fr 1fr', sm: '1fr' }}
                          w={'100%'}
                          h={{ base: '350px', sm: 'unset' }}
                          p={'12px 0px'}
                          textAlign={{ base: 'center', sm: 'start' }}
                          columnGap={'20px'}
                          rowGap={'20px'}
                        >
                          <Button
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

                          <Flex flexWrap={'wrap'} gap={'10px'} alignItems={'center'}>
                            {ingredients.map((field, index) => (
                              <Box key={`ingredient_${index}`}>
                                <Badge>{field.name}</Badge>
                              </Box>
                            ))}
                          </Flex>

                          <GridItem
                            textAlign={'center'}
                            gridColumnStart={{ sm: 4 }}
                            gridRowStart={{ base: '4', sm: 'unset' }}
                          >
                            <AccordionIcon />
                          </GridItem>
                        </Grid>
                      </AccordionButton>

                      {/* 1.5 5 0.5 0.3 */}
                      {/* 1.5 5.5 0.3 */}
                      {/* Group of inputs for customizing ingredients */}
                      <AccordionPanel
                        pos={{ base: expandedIndex.length ? 'absolute' : 'unset', sm: 'unset' }}
                        top={{ base: expandedIndex.length ? '0' : 'unset', sm: 'unset' }}
                        right={{ base: expandedIndex.length ? '0' : 'unset', sm: 'unset' }}
                        h={{ base: expandedIndex.length ? '100%' : 'unset', sm: 'unset' }}
                        w={{ base: expandedIndex.length ? '100%' : 'unset', sm: 'unset' }}
                        bg={bg}
                        zIndex={99}
                      >
                        {ingredients.map(({ name, unit }, index) => (
                          <Grid
                            templateColumns={{ base: '100%', sm: '1.5fr 4.5fr 1fr 0.3fr' }}
                            key={`${name}_${index}`}
                            p="12px 0px"
                            columnGap={'20px'}
                            rowGap={{ base: '20px', sm: 'unset' }}
                          >
                            <Input
                              {...register(`ingredients.${index}.name`, { required: true })}
                              isInvalid={errors.ingredients?.[index]?.name?.type === 'required'}
                              placeholder={'Grocery'}
                            />

                            <Grid
                              templateColumns={'1fr 1fr 1fr'}
                              // w="100%"
                              textAlign={'start'}
                              columnGap={'20px'}
                            >
                              <Input
                                type="number"
                                {...register(`ingredients.${index}.amount`, {
                                  valueAsNumber: true,
                                  min: 0,
                                  validate: amount => {
                                    if (amount) return validateIsNumber(amount);
                                  },
                                })}
                                isInvalid={errors.ingredients?.[index]?.amount?.type === 'validate'}
                                placeholder={'Amount'}
                              />

                              <Select
                                {...register(`ingredients.${index}.unit`)}
                                color={unit ? 'black' : 'grey'}
                                placeholder={'Unit*'}
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

                            <Input
                              type="number"
                              {...register(`ingredients.${index}.price`, {
                                valueAsNumber: true,
                                min: 0,
                                validate: price => {
                                  if (price) return validateIsNumber(price);
                                },
                              })}
                              placeholder={'Price'}
                            />

                            <GridItem textAlign={'center'}>
                              <IconButton
                                aria-label="Remove ingredient"
                                icon={<DeleteIcon />}
                                onClick={() => removeIngredient(index)}
                              />
                            </GridItem>
                          </Grid>
                        ))}

                        <Grid
                          templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                          p="12px 0px"
                          columnGap={'20px'}
                        >
                          {!ingredients.length ? (
                            <Heading textAlign={'center'} gridColumn={'2/3'}>
                              Add some ingredients
                            </Heading>
                          ) : null}

                          <GridItem textAlign={'center'} gridColumnStart={4}>
                            <IconButton
                              aria-label="Add ingredient"
                              icon={<AddIcon />}
                              onClick={() => appendIngredient({})}
                            />
                          </GridItem>
                        </Grid>
                      </AccordionPanel>
                    </Flex>
                  )}
                </AccordionItem>
              ) : null}
            </Accordion>

            {groceryLists.length === 0 ? (
              <Heading my={'header'} textAlign={'center'}>
                Create a new list
              </Heading>
            ) : null}
          </Flex>
        </Flex>
      </FormProvider>
    </form>
  );
};

export default GroceryLists;
