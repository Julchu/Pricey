import type { NextPage } from 'next';
import Head from 'next/head';
import Functions from '../components/Functions';
import Layout from '../components/Layout';

const FunctionsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Pricey</title>
        <meta name="description" content="About Us" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Functions />
      </Layout>
    </>
  );
};

export default FunctionsPage;
