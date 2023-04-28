import {
  Button,
  Box,
  Center,
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
  HStack,
  useMediaQuery,
} from '@chakra-ui/react';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db, GroceryList, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import useGroceryList from '../../hooks/useGroceries';
import Fuse from 'fuse.js';

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
  const { authUser } = useAuth();
  const [{ submitGroceryList }, loading] = useGroceryList();
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
    setValue,
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

  // useEffect(() => {
  //   console.log(groceryLists);
  // }, [groceryLists]);

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

  // Simplified fuzzy search with Fuse.js
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
            gridColumn={{ base: '1/3', sm: '1/3' }}
            placeholder={'Grocery list name'}
            {...register('name', { required: true })}
          />

          <Input
            placeholder={'Grocery'}
            onChange={e => setValue(`ingredients.${0}.name`, e.target.value)}
          />
          <Input
            placeholder={'Grocery'}
            onChange={e => setValue(`ingredients.${1}.name`, e.target.value)}
          />
          <Input
            placeholder={'Grocery'}
            onChange={e => setValue(`ingredients.${2}.name`, e.target.value)}
          />
          <Input
            placeholder={'Grocery'}
            onChange={e => setValue(`ingredients.${3}.name`, e.target.value)}
          />
        </Grid>
      </Flex>

      {/* "Table" */}
      <Flex p={{ base: '30px 0px', sm: '0px 30px' }} mt={'header'} flexDir={'column'}>
        {/* "Table" Header */}
        <Grid
          templateColumns={'1.5fr 5fr 0.5fr 0.3fr'}
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
                    templateColumns={'1.5fr 5fr 0.5fr 0.3fr'}
                    w="100%"
                    // p="12px 0px"
                    textAlign={'start'}
                    columnGap={'20px'}
                  >
                    <Text>{list.name}</Text>

                    <Flex flexWrap={'wrap'} gap={'10px'}>
                      {list.ingredients.map((ingredient, index) => {
                        return (
                          <Box key={`ingredient_${index}`}>
                            <Badge>{ingredient.name}</Badge>
                          </Box>
                        );
                      })}
                    </Flex>

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
                  <Grid templateColumns={'1.5fr 5fr 0.5fr 0.3fr'}>
                    <GridItem />
                    <GridItem>
                      {list.ingredients.map(({ name, amount, unit, quantity, price }, index) => {
                        return (
                          <Grid
                            templateColumns={'1fr 1fr 1fr 1fr 1fr'}
                            columnGap={'20px'}
                            key={`expandedIngredient_${index}`}
                          >
                            {name ? <Button>{name}</Button> : <Box />}
                            {amount ? <Button>{amount}</Button> : <Box />}
                            {unit ? <Button>{unit}</Button> : <Box />}
                            {quantity ? <Button>{quantity}</Button> : <Box />}
                            {price ? <Button>{price}</Button> : <Box />}
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
          <AccordionItem>
            <AccordionButton
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
                templateColumns={'1.5fr 5fr 0.5fr 0.3fr'}
                w="100%"
                p="12px 0px"
                textAlign={'start'}
                columnGap={'20px'}
              >
                {authUser && !groceryListCreator ? (
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
                ) : null}
                <Flex flexWrap={'wrap'} gap={'10px'} alignItems={'center'}>
                  {ingredients.map((field, index) => (
                    <Box key={`ingredient_${index}`}>
                      <Badge>{field.name}</Badge>
                    </Box>
                  ))}
                </Flex>
                <GridItem />
                <GridItem textAlign={'center'}>
                  <AccordionIcon />
                </GridItem>
              </Grid>
            </AccordionButton>

            <AccordionPanel>
              <Grid
                templateColumns={'0.5fr 5fr 0.1fr'}
                w="100%"
                p="12px 0px"
                textAlign={'start'}
                columnGap={'20px'}
              >
                <GridItem />

                <Box>
                  {fieldsIngredient.map((field, index) => (
                    <Flex key={field.id} flexDir={'row'}>
                      <Input {...register(`ingredients.${index}.name`)} />
                      <IconButton
                        aria-label="Remove ingredient"
                        icon={<DeleteIcon />}
                        onClick={() => removeIngredient(index)}
                      />
                    </Flex>
                  ))}

                  <IconButton
                    aria-label="Add ingredient"
                    icon={<AddIcon />}
                    onClick={() => appendIngredient({})}
                  />

                  {/* <IngredientForm /> */}
                </Box>
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {groceryLists.length === 0 ? (
          <Center my={'header'}>
            <Heading>Create a new list</Heading>
          </Center>
        ) : null}
      </Flex>
    </form>
  );
};

export default GroceryLists;
