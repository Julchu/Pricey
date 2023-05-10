import { Flex, Hide, Grid, Accordion, AccordionItem, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { GroceryList } from '../../lib/firebase/interfaces';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';
import CurrentListAccordion from './currentListAccordion';
import NewListAccordion from './newListAccordion';

const ListTable: FC<{
  filteredLists: GroceryList[];
  newListName: string;
  groceryListsLength: number;
}> = ({ filteredLists, newListName, groceryListsLength }) => {
  const { authUser } = useAuthContext();
  const { expandedIndex, groceryListCreator } = useGroceryListContext();

  return (
    <Flex mt={'header'} flexDir={'column'} flexGrow={{ base: 1, sm: 'unset' }}>
      {/* "Table" Header */}
      <Hide below="md">
        <Grid
          templateColumns={'1.5fr 4.5fr 1fr 0.3fr'}
          w={'100%'}
          p={'12px 46px'}
          columnGap={'20px'}
          textTransform={'uppercase'}
          color={'tableHeader'}
        >
          <Text as={'b'} textAlign={'start'}>
            Name
          </Text>
          <Text as={'b'} textAlign={'start'}>
            Ingredients
          </Text>
          <Text as={'b'} textAlign={'end'}>
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
        {/* Start new list */}
        {/* Accordion button row */}
        {authUser && !groceryListCreator ? (
          <AccordionItem
            key={6}
            isFocusable={false}
            scrollSnapAlign={'center'}
            mr={{ base: '30px', sm: 'unset' }}
          >
            {({ isExpanded }) => (
              <NewListAccordion
                isExpanded={isExpanded}
                groceryListsLength={groceryListsLength}
                newListName={newListName}
              />
            )}
          </AccordionItem>
        ) : null}

        {filteredLists.map((list, index) => {
          return (
            <AccordionItem
              key={`list_${index}`}
              isFocusable={false}
              scrollSnapAlign={'center'}
              _last={{ mr: { base: '30px', sm: 'unset' } }}
            >
              {({ isExpanded }) => (
                <CurrentListAccordion isExpanded={isExpanded} index={index + 1} list={list} />
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </Flex>
  );
};

export default ListTable;
