//  editable grocery list
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import GroceryLists from '../../components/GroceryLists';
import { AuthUnauthorized } from '../../components/AuthGuards';

// Shows initial empty grocery list form
const GroceryCreatorPage: NextPage = () => {
  const { authUser } = useAuth();

  if (!authUser) return <AuthUnauthorized />;
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
