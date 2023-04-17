import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Preferences from '../components/Preferences';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Preferences</title>
        <meta name="description" content="About Us" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Preferences />
      </Layout>
    </>
  );
};

export default AboutPage;
