import type { NextPage } from 'next';
import Head from 'next/head';
import GroceryList from '../../components/GroceryList';
import Layout from '../../components/Layout';

// Shows initial empty grocery list form
const GroceryListPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>GroceryList</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <GroceryList />
      </Layout>
    </>
  );
};

export default GroceryListPage;
