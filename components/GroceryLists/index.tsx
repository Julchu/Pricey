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
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { Ingredient } from '../../lib/firebase/interfaces';

export type GroceryFormData = {
  groceryListId?: string;
  name: string;
  ingredients: Ingredient[];
  userId: string;
  public?: boolean;
};

const MyGroceries: FC<{ groceryListCreator: string }> = ({ groceryListCreator }) => {
  const { authUser } = useAuth();

  // TODO: use user-chosen username instead of user's documentId

  return (
    <>
      <NextLink href={`${authUser?.id}/Cheese`}>
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
    </>
  );
};

export default MyGroceries;
