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
  List,
  ListItem,
  Card,
} from '@chakra-ui/react';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { db, GroceryList, Ingredient, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import useGroceryListHook from '../../hooks/useGroceryListHook';
import Fuse from 'fuse.js';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { useCombobox } from 'downshift';

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

  const {
    fields: fieldsIngredient,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
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
  const filteredResults = useMemo(() => {
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

  return (
    <form>
      <FormProvider {...methods}>
        {/* Header inputs */}
        <Flex
          flexDir={{ base: 'column', sm: 'row' }}
          // display={{
          //   base: expandedIndex.length && expandedIndex[0] > -1 ? 'none' : 'flex',
          //   sm: 'flex',
          // }}
        >
          <Grid
            m={{ base: '0px 30px', sm: '20px 0px' }}
            templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(6, 1fr)' }}
            rowGap={{ base: '20px' }}
            columnGap={{ base: '20px', sm: '30px' }}
          >
            <Input
              isInvalid={errors.name?.type === 'required'}
              gridColumn={{ base: '1/3', sm: '1/3' }}
              placeholder={'Grocery list name'}
              {...register('name', { required: true })}
            />

            {/* Header grocery inputs */}
            <IngredientComboBox index={0} />
            <IngredientComboBox index={1} />
            <IngredientComboBox index={2} />
            <IngredientComboBox index={3} />
          </Grid>
        </Flex>

        {/* "Table" */}
        <Flex p={{ base: '30px 0px', sm: '0px 30px' }} mt={'header'} flexDir={'column'}>
          {/* "Table" Header */}
          <Grid
            templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
            w="100%"
            p="12px 16px"
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

          {/* "Table" content */}
          <Accordion index={expandedIndex}>
            {filteredResults.map((list, index) => {
              return (
                <AccordionItem key={`list_${index}`} isFocusable={false}>
                  <AccordionButton
                    onClick={() => {
                      setExpandedIndex(previousArray => {
                        if (previousArray.length && previousArray[0] === index) return [];
                        else return [index];
                      });
                    }}
                  >
                    <Grid
                      templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                      w="100%"
                      // p="12px 0px"
                      textAlign={'start'}
                      columnGap={'20px'}
                    >
                      <Text>{list.name}</Text>

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
                    zIndex={99}
                  >
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
                </AccordionItem>
              );
            })}

            {/* Start new list */}
            {/* Accordion button row */}
            {authUser && !groceryListCreator ? (
              <AccordionItem isFocusable={false}>
                <AccordionButton
                  py={0}
                  as={Box}
                  cursor={'pointer'}
                  onClick={() => {
                    setExpandedIndex(previousArray => {
                      if (previousArray.length && previousArray[0] === filteredResults.length)
                        return [];
                      else return [filteredResults.length];
                    });
                  }}
                >
                  <Grid
                    templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                    w="100%"
                    p="12px 0px"
                    textAlign={'start'}
                    columnGap={'20px'}
                  >
                    <Button
                      onClick={handleSubmit(onSubmitHandler)}
                      whiteSpace={'normal'}
                      wordBreak={'break-word'}
                      h={'fit-content'}
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

                    <GridItem textAlign={'center'} gridColumnStart={4}>
                      <AccordionIcon />
                    </GridItem>
                  </Grid>
                </AccordionButton>

                {/* 1.5 5 0.5 0.3 */}
                {/* 1.5 5.5 0.3 */}
                {/* Group of inputs for customizing ingredients */}
                <AccordionPanel>
                  {ingredients.map(({ name, unit }, index) => (
                    <Grid
                      templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                      key={`${name}_${index}`}
                      p="12px 0px"
                      columnGap={'20px'}
                    >
                      <Input {...register(`ingredients.${index}.name`)} />

                      <Grid
                        templateColumns={'1fr 1fr 1fr'}
                        w="100%"
                        textAlign={'start'}
                        columnGap={'20px'}
                      >
                        <Input
                          {...register(`ingredients.${index}.amount`)}
                          placeholder={'Amount'}
                        />

                        <Select
                          {...register(`ingredients.${index}.unit`)}
                          color={unit ? 'black' : 'grey'}
                          isInvalid={errors.ingredients?.[index]?.unit?.type === 'required'}
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
                          {...register(`ingredients.${index}.quantity`)}
                          placeholder={'Quantity'}
                        />
                      </Grid>

                      <Input {...register(`ingredients.${index}.price`)} placeholder={'Price'} />

                      <GridItem textAlign={'center'}>
                        <IconButton
                          aria-label="Remove ingredient"
                          icon={<DeleteIcon />}
                          onClick={() => removeIngredient(index)}
                        />
                      </GridItem>
                    </Grid>
                  ))}

                  <Grid templateColumns={'1.5fr 4.5fr 1fr 0.3fr'} p="12px 0px" columnGap={'20px'}>
                    <GridItem textAlign={'center'} gridColumnStart={4}>
                      <IconButton
                        aria-label="Add ingredient"
                        icon={<AddIcon />}
                        onClick={() => appendIngredient({})}
                      />
                    </GridItem>
                  </Grid>
                </AccordionPanel>
              </AccordionItem>
            ) : null}
          </Accordion>

          {groceryLists.length === 0 ? (
            <Heading my={'header'} textAlign={'center'}>
              Create a new list
            </Heading>
          ) : null}
        </Flex>
      </FormProvider>
    </form>
  );
};

const IngredientComboBox: FC<{
  index: number;
}> = ({ index }) => {
  const { setValue } = useFormContext<GroceryListFormData>();

  const { currentIngredients } = useIngredientContext();

  const [filteredResults, setFilteredResults] = useState<WithDocId<Ingredient>[]>([]);
  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    items: filteredResults,
    itemToString: (ingredient: WithDocId<Ingredient> | null) => (ingredient ? ingredient.name : ''),
    onInputValueChange: ({ inputValue }) => {
      if (inputValue) setValue(`ingredients.${index}.name`, inputValue);
      const fuse = new Fuse(currentIngredients, {
        keys: ['name'],
        ignoreLocation: true,
      });

      const results = fuse.search(inputValue ? inputValue : '', {
        limit: 5,
      });

      setFilteredResults(
        inputValue
          ? results.map(result => {
              return result.item;
            })
          : [],
      );
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) setValue(`ingredients.${index}`, { ...selectedItem });
    },
  });

  return (
    <Flex flexDir={'column'} pos={'relative'}>
      <Flex>
        <Input {...getInputProps()} placeholder={'Grocery'} />
      </Flex>

      <List
        as={Card}
        display={isOpen && filteredResults.length ? 'unset' : 'none'}
        pos={'absolute'}
        py={2}
        mt={'50px'}
        mx={0} // for mobile
        overflowY="auto"
        maxWidth={'100%'}
        zIndex={98} // Remain under expanded accordions
        {...getMenuProps()}
      >
        {filteredResults.map((item, index) => (
          <ListItem
            transition={'background-color 220ms, color 220ms'}
            bg={index === highlightedIndex ? 'coral' : null}
            px={'12px'}
            py={'6px'}
            cursor="pointer"
            key={`${item}_${index}`}
            {...getItemProps({ item, index })}
          >
            {item.name}
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};

export default GroceryLists;
