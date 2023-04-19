import type { NextPage } from 'next';
import Head from 'next/head';
import IngredientList from '../components/HomeDashboard';
import Layout from '../components/Layout';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Tracking overpriced shopping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <IngredientList />
      </Layout>
    </>
  );
};

export default IndexPage;
