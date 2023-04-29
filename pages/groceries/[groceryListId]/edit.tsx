import Head from 'next/head';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import EditList from '../../../components/GroceryLists/newList';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../hooks/useAuthContext';

// Shows initial empty grocery list form
const GroceryListPage: NextPage = () => {
  const { authUser } = useAuthContext();
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
        <EditList
          groceryListCreator={groceryListCreator as string}
          groceryListId={groceryListId as string}
        />
      </Layout>
    </>
  );
};

export default GroceryListPage;
