import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Unauthorized } from '../../components/AuthGuards';
import GroceryLists from '../../components/GroceryLists';
import { GroceryListContext } from '../../hooks/useGroceryListContext';
import Layout from '../../components/Layout';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState } from 'react';

// Shows initial empty grocery list form
const GroceryListPage: NextPage = () => {
  const { authUser } = useAuthContext();
  const router = useRouter();
  const { groceryListCreator } = router.query;
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);

  return (
    <>
      <Head>
        <title>New Grocery List</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {authUser ? (
          <GroceryListContext.Provider
            value={{
              expandedIndex,
              setExpandedIndex,
              groceryListCreator: groceryListCreator as string,
            }}
          >
            <GroceryLists />
          </GroceryListContext.Provider>
        ) : (
          <Unauthorized />
        )}
      </Layout>
    </>
  );
};

export default GroceryListPage;