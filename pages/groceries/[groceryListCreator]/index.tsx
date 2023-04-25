import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GroceryLists from '../../../components/GroceryLists';
import Layout from '../../../components/Layout';

// Shows initial empty grocery list form
const GroceryCreatorPage: NextPage = () => {
  const router = useRouter();
  const { groceryListCreator } = router.query;

  return (
    <>
      <Head>
        <title>Grocery Lists</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <GroceryLists groceryListCreator={groceryListCreator as string} />
      </Layout>
    </>
  );
};

export default GroceryCreatorPage;
