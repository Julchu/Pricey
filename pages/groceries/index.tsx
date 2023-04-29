import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuthContext } from '../../hooks/useAuthContext';
import Layout from '../../components/Layout';
import GroceryLists from '../../components/GroceryLists';
import { AuthUnauthorized } from '../../components/AuthGuards';

/* Paths:
 * pricey.app/groceries (index): shows logged-in user's list of grocery lists
 * pricey.app/groceries/new (new): create new grocery list
 * pricey.app/groceries/<groceryListId> (index): fetches <groceryListId> list (if public)
 * pricey.app/groceries/<groceryListId>/edit (edit): fetches <groceryListId> list if logged-in user is groceryListCreator
 */
// Shows initial empty grocery list form
const GroceryCreatorPage: NextPage = () => {
  const { authUser } = useAuthContext();

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
