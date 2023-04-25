import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  HStack,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { db, GroceryList, WithDocId } from '../../lib/firebase/interfaces';
import { onSnapshot, query, where } from 'firebase/firestore';

/**
 * @param groceryListCreator: URL parameter
 * @purpose Firestore query to fetch grocery lists
 * * if no groceryListCreator, logged in user's docId
 * * else groceryListCreator as preferences.displayName or groceryListCreator as docId
 */
const GroceryLists: FC<{ groceryListCreator?: string }> = ({ groceryListCreator }) => {
  const { authUser } = useAuth();
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);

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

  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={'header'} h={'40px'}>
          <Center>
            <Heading>Grocery List</Heading>
          </Center>
        </Box>
      </Flex>

      <Box p={{ base: '30px 0px', sm: '0px 30px' }} mt={'header'}>
        <HStack>
          <Spacer />

          {authUser && !groceryListCreator ? (
            <Button as={NextLink} href={`groceries/${authUser?.documentId}/new`}>
              New List
            </Button>
          ) : null}
        </HStack>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Ingredients</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groceryLists.map((list, index) => {
                return (
                  <Tr key={`list_${index}`}>
                    <Td>inches</Td>
                    <Td>millimetres (mm)</Td>
                    <Td isNumeric>25.4</Td>)
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          {groceryLists.length === 0 ? (
            <Center my={'header'}>
              <Heading>Create a new list</Heading>
            </Center>
          ) : null}
        </TableContainer>
      </Box>
    </>
  );
};

export default GroceryLists;
