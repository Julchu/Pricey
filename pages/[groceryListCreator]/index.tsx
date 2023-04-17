//  editable grocery list
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MyGroceries from '../../components/GroceryLists';

import Layout from '../../components/Layout';

// Shows initial empty grocery list form
const GroceryCreatorPage: NextPage = () => {
  const router = useRouter();

  const { groceryListCreator } = router.query;

  // TODO: use user-chosen username instead of user's documentId

  return (
    <>
      <Head>
        <title>Grocery Lists</title>
        <meta name="description" content="Grocery List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {groceryListCreator ? (
          <MyGroceries groceryListCreator={groceryListCreator as string} />
        ) : null}
      </Layout>
    </>
  );
};

export default GroceryCreatorPage;
