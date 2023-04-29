import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuthContext } from '../../hooks/useAuthContext';
import Layout from '../../components/Layout';
import GroceryLists from '../../components/GroceryLists';
import { AuthUnauthorized } from '../../components/AuthGuards';

/* Paths:
 * pricey.app/profile (index): shows logged-in user's list of grocery lists (same as pages/groceries/index)
 * pricey.app/profile/<groceryListCreator> (index): fetches <groceryListCreator>'s list of grocery lists
 */
// Shows initial empty grocery list form
const ProfilePage: NextPage = () => {
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

export default ProfilePage;
