//  editable grocery list
import type { NextPage } from 'next';
import Head from 'next/head';

// Shows initial empty grocery list form
const GroceryList: NextPage = () => {
  return (
    <>
      <Head>
        <title>GroceryList</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Grocery List</h1>
    </>
  );
};

export default GroceryList;
