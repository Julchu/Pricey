import type { NextPage } from 'next';
import Head from 'next/head';
import Index from '../components/Index';

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Tracking overpriced shopping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Index />
    </>
  );
};

export default IndexPage;
