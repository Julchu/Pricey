import type { NextPage } from 'next';
import Head from 'next/head';
import About from '../components/About';
import Layout from '../components/Layout';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Pricey</title>
        <meta name="description" content="About Us" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <About />
      </Layout>
    </>
  );
};

export default AboutPage;
