import type { NextPage } from 'next';
import Head from 'next/head';
import Functions from '../components/Functions';
import Layout from '../components/Layout';

const FunctionsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Functions</title>
        <meta name="description" content="Functions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Functions />
      </Layout>
    </>
  );
};

export default FunctionsPage;
