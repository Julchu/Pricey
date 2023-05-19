// import React from 'react';
import Layout from '../../components/Layout';
import CropAlgorithm from '../../components/Algorithms/CropAlgorithm';

/* NextJS will take the folder's name as the route (URL), and display the inner CropAlgorithm.tsx
 * Ex: localhost:3000/template
 */
const AlgorithmsPage: () => null | JSX.Element = () => {
  return (
    <Layout>
      <CropAlgorithm />
      <CropAlgorithm />
    </Layout>
  );
};

export default AlgorithmsPage;