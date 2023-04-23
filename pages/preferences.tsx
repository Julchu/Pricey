import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import Preferences from '../components/Preferences';
import { useAuth } from '../hooks/useAuth';

const AboutPage: NextPage = () => {
  const { authUser } = useAuth();
  const router = useRouter();

  // if (!authUser) {
  //   router.push(`/`);
  // }
  // console.log(authUser);

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
