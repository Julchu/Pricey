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
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
// import { Link } from '@chakra-ui/next-js';
import { useAuth } from '../../hooks/useAuth';
import { Ingredient } from '../../lib/firebase/interfaces';

export type GroceryFormData = {
  groceryListId?: string;
  name: string;
  ingredients: Ingredient[];
  userId: string;
  viewable?: boolean;
};

const MyGroceries: FC<{ groceryListCreator: string }> = ({ groceryListCreator }) => {
  const { authUser } = useAuth();

  // TODO: use user-chosen username instead of user's documentId

  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={'header'} h={'40px'}>
          <Center>
            <Heading>Grocery List</Heading>
          </Center>
        </Box>
      </Flex>

      {/* <Divider boxShadow={'focus'} /> */}

      <Container>
        There are many benefits to a joint design and development system. Not only does it bring
        benefits to the design team, but it also brings benefits to engineering teams. It makes sure
        that our experiences have a consistent look and feel, not just in our design specs, but in
        production
        <NextLink href={`${authUser?.documentId}/Cheese`}>
          <Button>New List</Button>
        </NextLink>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default MyGroceries;
