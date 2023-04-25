//  editable grocery list
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import GroceryLists from '../../components/GroceryLists';

// Shows initial empty grocery list form
const GroceryCreatorPage: NextPage = () => {
  const { authUser } = useAuth();

  if (!authUser?.documentId) return null;
  return (
    <>
      <Head>
        <title>Grocery Lists</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <GroceryLists />
      </Layout>
    </>
  );
};

export default GroceryCreatorPage;
