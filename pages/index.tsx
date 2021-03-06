import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback } from 'react';
import Home, { IngredientFormData } from '../components/Home';
import Layout from '../components/Layout';
import useCreateIngredient from '../hooks/useCreateIngredient';

const IndexPage: NextPage = () => {
  const [{ createIngredient }, _loading, _error] = useCreateIngredient();

  const onSubmit = useCallback(
    async (data: IngredientFormData): Promise<void> => {
      await createIngredient(data);
    },
    [createIngredient],
  );

  // const onSubmit = useCallback(
  //   async (data: RecipeFormData, cb): Promise<void> => {
  //     const ref = await updateRecipe(data);
  //     cb ? cb(ref) : router.push('/recipes');
  //   },
  //   [updateRecipe, router],
  // );

  // const onDelete = useCallback(async (): Promise<void> => {
  //   await remove();
  //   router.push('/recipes');
  // }, [remove, router]);

  return (
    <>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Tracking overpriced shopping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Home onSubmit={onSubmit} />
      </Layout>
    </>
  );
};

export default IndexPage;
