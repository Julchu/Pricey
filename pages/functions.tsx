import type { NextPage } from 'next';
import Head from 'next/head';
import { AuthUnauthorized } from '../components/AuthGuards';
import Functions from '../components/Functions';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../lib/firebase/interfaces';

const FunctionsPage: NextPage = () => {
  const { authUser } = useAuth();

  return (
    <>
      <Head>
        <title>Functions</title>
        <meta name="description" content="Functions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>{authUser?.role === Role.admin ? <Functions /> : <AuthUnauthorized />}</Layout>
    </>
  );
};

export default FunctionsPage;
