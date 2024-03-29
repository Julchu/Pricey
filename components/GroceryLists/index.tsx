import { Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { db, GroceryList, Unit, WithDocId } from '../../lib/firebase/interfaces';
import { FormProvider, useForm } from 'react-hook-form';
import ListForm from './listForm';
import ListTable from './listTable';
import { onSnapshot, query, where } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';

export type GroceryListFormIngredient = {
  name: string;
  capacity?: number;
  unit?: Unit;
  quantity?: number;
};

export type GroceryListFormData = {
  groceryListId?: string;
  name: string;
  ingredients: GroceryListFormIngredient[];
  viewable?: boolean;
};

/**
 * @param groceryListCreator: URL parameter
 * @purpose Firestore query to fetch grocery lists
 * * if no groceryListCreator, logged in user's docId
 * * else groceryListCreator as preferences.displayName or groceryListCreator as docId
 */
const GroceryLists: FC = () => {
  const { authUser } = useAuthContext();
  const { groceryListCreator } = useGroceryListContext();
  const [groceryLists, setGroceryLists] = useState<WithDocId<GroceryList>[]>([]);
  const methods = useForm<GroceryListFormData>({
    defaultValues: {
      name: '',
      ingredients: [],
      viewable: false,
    },
  });

  const newListName = methods.watch('name');

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
  }, [authUser?.documentId, groceryListCreator, setGroceryLists]);

  // Search grocery lists
  const fuse = new Fuse(groceryLists, {
    keys: ['name', 'ingredients.name'],
    ignoreLocation: true,
  });

  const results = fuse.search(newListName || '');

  const filteredLists = newListName
    ? results.map(result => {
        return result.item;
      })
    : groceryLists;

  return (
    <form>
      <FormProvider {...methods}>
        <Flex h="calc(100svh - 80px)" flexDir={'column'} display={{ base: 'flex', sm: 'block' }}>
          {/* Header inputs */}
          <Flex flexDir={{ base: 'column', sm: 'row' }}>
            <ListForm />
          </Flex>

          {/* "Table" */}
          <ListTable
            filteredLists={filteredLists}
            newListName={newListName}
            groceryListsLength={groceryLists.length}
          />
        </Flex>
      </FormProvider>
    </form>
  );
};

export default GroceryLists;