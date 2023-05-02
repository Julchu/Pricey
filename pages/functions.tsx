import type { NextPage } from 'next';
import Head from 'next/head';
import { Unauthorized } from '../components/AuthGuards';
import Functions from '../components/Functions';
import Layout from '../components/Layout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Role } from '../lib/firebase/interfaces';

const FunctionsPage: NextPage = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Head>
        <title>Functions</title>
        <meta name="description" content="Functions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>{authUser?.role === Role.admin ? <Functions /> : <Unauthorized />}</Layout>
    </>
  );
};

export default FunctionsPage;
