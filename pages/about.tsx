import type { NextPage } from 'next';
import Head from 'next/head';
import IndexPage from '../components/Index';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Pricey</title>
        <meta name="description" content="Tracking overpriced shopping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <IndexPage />
    </>
  );
};

export default AboutPage;
