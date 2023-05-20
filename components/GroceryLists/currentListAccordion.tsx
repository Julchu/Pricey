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
  Show,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { GroceryList, Unit } from '../../lib/firebase/interfaces';
import { calcTotalPrice, currencyFormatter } from '../../lib/textFormatters';

const CurrentListAccordion: FC<{
  isExpanded: boolean;
  index: number;
  list: GroceryList;
}> = ({ isExpanded, index, list }) => {
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const { setExpandedIndex } = useGroceryListContext();
  const bg = useColorModeValue('white', 'gray.800');

  /** Created memoized object with
   * @property prices: { ingredient name, capacity, unit, quantity } and price: converted price * capacity * quantity // ingredient info
   * @property totalPrice: combined total price of all ingredients
   * */
  const listPrice = useMemo(() => {
    return list.ingredients.reduce<{
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
  }, [currentIngredients, ingredientIndexes, list.ingredients]);

  return (
    <Flex h={{ base: '100%', sm: 'unset' }} flexDir={'column'}>
      <AccordionButton
        h={{ base: '100%', sm: 'unset' }}
        w={{ sm: '100%' }}
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
          <Text as={'b'} display={'block'} alignSelf={'center'}>
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

        {/* Ingredient info list "table" */}
        {listPrice.listIngredients.map(({ name, capacity, unit, quantity, price }, index) => {
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
                  <Text textAlign={'end'}>{price ? currencyFormatter.format(price) : '-'}</Text>
                </Grid>
              </GridItem>
            </Grid>
          );
        })}
      </AccordionPanel>
    </Flex>
  );
};

export default CurrentListAccordion;