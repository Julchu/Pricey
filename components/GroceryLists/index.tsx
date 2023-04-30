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
  Menu,
  MenuButton,
  MenuList,
  useMenu,
  forwardRef,
  BoxProps,
  MenuGroup,
  MenuItem,
} from '@chakra-ui/react';

import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { db, GroceryList, Ingredient, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useForm, FormProvider, useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import useGroceryListHook from '../../hooks/useGroceryListHook';
import Fuse from 'fuse.js';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { useDebouncedState } from '../../hooks/useDebouncedState';

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
      includeScore: true,
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
            <DropdownIngredient index={0} />
            <DropdownIngredient index={1} />
            <DropdownIngredient index={2} />
            <DropdownIngredient index={3} />
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
                <AccordionItem key={`list_${index}`}>
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
              <AccordionItem>
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
                  {fieldsIngredient.map((field, index) => (
                    <Grid
                      templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
                      key={field.id}
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
                          color={ingredients[index].unit ? 'black' : 'grey'}
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

/* TODO: create custom dropdown menu for Ingredients */
// TODO: convert to Combobox
const DropdownIngredient: FC<{
  index: number;
}> = ({ index }) => {
  const { control } = useFormContext<GroceryListFormData>();
  const { update: updateIngredient } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const [ingredients] = useWatch({
    control,
    name: [`ingredients.${index}`],
  });

  const onTyping = useCallback(
    (ingredientName: string) => {
      updateIngredient(index, { name: ingredientName });
    },
    [index, updateIngredient],
  );

  const onSelectIngredient = useCallback(
    ({ name, price }: WithDocId<Ingredient>) => {
      updateIngredient(index, { name, price });
    },
    [index, updateIngredient],
  );

  const { currentIngredients } = useIngredientContext();

  const filteredResults = useMemo(() => {
    const fuse = new Fuse(currentIngredients, {
      keys: ['name'],
      includeScore: true,
      ignoreLocation: true,
    });

    const results = fuse.search(ingredients ? ingredients.name : '', { limit: 5 });

    return ingredients && ingredients.name
      ? results.map(result => {
          return result.item;
        })
      : currentIngredients;
  }, [currentIngredients, ingredients]);

  // Used to manually trigger opening menu from custom events on input box, like typing, clicking when there's text
  const { onOpen, isOpen } = useMenu();

  // Used to override MenuItem autofocus by manually focusing Ingredient input box
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Menu isOpen={isOpen} autoSelect={false} matchWidth initialFocusRef={inputRef}>
      <MenuButton as={DropdownInput} onOpen={onOpen} onTyping={onTyping} inputRef={inputRef} />

      <MenuList>
        <MenuGroup>
          {filteredResults.map((ingredient, index) => {
            return (
              <MenuItem
                isFocusable={false}
                closeOnSelect
                key={`${ingredient.name}_${index}`}
                value={ingredient.name}
                onFocusCapture={() => {
                  if (inputRef.current) inputRef.current.focus();
                }}
                onMouseOutCapture={() => {
                  if (inputRef.current) inputRef.current.focus();
                }}
                onClickCapture={e => {
                  if (inputRef.current) inputRef.current.focus();
                  if (inputRef.current) {
                    inputRef.current.value = e.currentTarget.value;
                    onSelectIngredient(ingredient);
                  }
                }}
              >
                {ingredient.name}
              </MenuItem>
            );
          })}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

/**
 * @param onOpen: triggers opening menu
 * @param onTyping: passed down function for updating React Hook Form ingredient
 * @param inputRef: ref for input as workaround to not focus MenuItems, but rather continue focus on input
 */
const DropdownInput: FC<{
  onOpen: () => void;
  onTyping: (value: string) => void;
  inputRef: RefObject<HTMLInputElement>;
}> = forwardRef<
  BoxProps & {
    onOpen: () => void;
    onTyping: (value: string) => void;
    inputRef: RefObject<HTMLInputElement>;
  },
  'div'
>((props, ref) => {
  const { onOpen, onTyping, inputRef } = props;

  return (
    // Box needs ref for Menu to be attached to this input
    <Box ref={ref}>
      <Input
        ref={inputRef}
        onFocusCapture={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
        onClickCapture={e => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
          if (e.currentTarget.value) onOpen();
        }}
        onMouseOutCapture={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        onChangeCapture={e => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
          onOpen();
          onTyping(e.target.value);
        }}
        placeholder={'Grocery'}
      />
    </Box>
  );
});

export default GroceryLists;
