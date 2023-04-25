import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewList from '../../components/GroceryLists/newList';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';

// Shows initial empty grocery list form
const GroceryListPage: NextPage = () => {
  const { authUser } = useAuth();
  const router = useRouter();
  const { groceryListCreator, groceryListId } = router.query;

  return (
    <>
      <Head>
        <title>New Grocery List</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <NewList
          groceryListCreator={groceryListCreator as string}
          groceryListId={groceryListId as string}
        />
      </Layout>
    </>
  );
};

export default GroceryListPage;