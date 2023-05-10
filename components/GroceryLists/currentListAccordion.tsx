import {
  useColorModeValue,
  Flex,
  AccordionButton,
  Grid,
  Badge,
  GridItem,
  AccordionIcon,
  AccordionPanel,
  Show,
  CloseButton,
  Box,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { GroceryList } from '../../lib/firebase/interfaces';
import { totalPrice, currencyFormatter } from '../../lib/textFormatters';

const CurrentListAccordion: FC<{
  isExpanded: boolean;
  index: number;
  list: GroceryList;
}> = ({ isExpanded, index, list }) => {
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const { setExpandedIndex } = useGroceryListContext();
  const bg = useColorModeValue('white', 'gray.800');
  const listPrice = list.ingredients.reduce<number>((price, { name, capacity, quantity }) => {
    const pricePerCapacity: number | undefined = ingredientIndexes[name]
      ? currentIngredients[ingredientIndexes[name]].price
      : undefined;

    const displayPrice: number | undefined = pricePerCapacity
      ? totalPrice(pricePerCapacity, capacity, quantity)
      : undefined;
    return displayPrice ? price + displayPrice : price;
  }, 0);

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
          {listPrice ? <Text textAlign={'end'}>{currencyFormatter.format(listPrice)}</Text> : null}

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
        <Show below="sm">
          <CloseButton
            ml={'auto'}
            onClick={() => {
              setExpandedIndex([]);
            }}
          />
        </Show>
        <Grid templateColumns={'1.5fr 4.5fr 1fr 0.3fr'} columnGap={'20px'} my={'10px'}>
          {list.ingredients.map(({ name, capacity, unit, quantity }, index) => {
            // TODO: multiply existing price by quantity/capacity
            const pricePerCapacity = ingredientIndexes[name]
              ? currentIngredients[ingredientIndexes[name]].price
              : undefined;

            const displayPrice = pricePerCapacity
              ? totalPrice(pricePerCapacity, capacity, quantity)
              : null;

            return (
              <GridItem
                gridColumnStart={'2'}
                gridColumnEnd={'4'}
                key={`expandedIngredient_${index}`}
              >
                <Grid templateColumns={'1fr 1fr 1fr 1fr 1fr'} columnGap={'20px'}>
                  {name ? <Text>{name}</Text> : <Box />}
                  {capacity ? <Text>{capacity}</Text> : <Box />}
                  {unit ? <Text>{unit}</Text> : <Box />}
                  {quantity ? <Text>{quantity}</Text> : <Box />}
                  {displayPrice ? <Text>{currencyFormatter.format(displayPrice)}</Text> : null}
                </Grid>
              </GridItem>
            );
          })}
        </Grid>
      </AccordionPanel>
    </Flex>
  );
};

export default CurrentListAccordion;
