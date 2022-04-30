import Layout from '../components/Layout';

export default function Custom404(): JSX.Element {
  return (
    <Layout>
      <p style={{ margin: 'auto', height: '100%', width: '100%' }}>
        {/* <Error statusCode={404} /> */}
        404
      </p>
    </Layout>
  );
}
