import { AbsoluteCenter, Heading } from '@chakra-ui/react';
import Layout from '../components/Layout';

export default function Custom404(): JSX.Element {
  return (
    <Layout>
      <AbsoluteCenter>
        <Heading as={'h1'}>Page not found</Heading>
      </AbsoluteCenter>
    </Layout>
  );
}
