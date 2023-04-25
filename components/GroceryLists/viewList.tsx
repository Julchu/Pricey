import { Flex, Box, Center, Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import useGroceryList from '../../hooks/useGroceries';
import { GroceryListFormData } from './newList';

const ViewList: FC<{ groceryListCreator: string; groceryListId: string }> = ({
  groceryListCreator,
  groceryListId,
}) => {
  const [{ updateGroceryList }, loading] = useGroceryList();
  // TODO: query for user-chosen grocery list name as groceryListId

  const { register } = useForm<GroceryListFormData>({
    defaultValues: {
      name: '',
      ingredients: [],
      viewable: false,
    },
  });

  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={'header'} h={'40px'}>
          <Center>
            <Heading>Edit grocery list</Heading>
          </Center>
        </Box>
      </Flex>

      <form></form>
    </>
  );
};

export default ViewList;
