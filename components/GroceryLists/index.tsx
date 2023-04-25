import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Button,
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Text,
  Spacer,
  HStack,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { db, GroceryList, Ingredient, User, WithDocId } from '../../lib/firebase/interfaces';
import { doc, documentId, limit, onSnapshot, or, query, where } from 'firebase/firestore';
// import firebase from 'firebase/app'
// import 'firebase/firestore'

export type GroceryFormData = {
  groceryListId?: string;
  name: string;
  ingredients: Ingredient[];
  userId: string;
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

  // Pre-make new list (but not save) with auto-generated document id
  const newListDocRef = doc(db.groceryListCollection);

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
            <Button as={NextLink} href={`groceries/${authUser?.documentId}/${newListDocRef.id}`}>
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
            <Tfoot>
              <Tr>
                <Th>Name</Th>
                <Th>Ingredients</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default GroceryLists;
