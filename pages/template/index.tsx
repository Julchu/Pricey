// import React from 'react';
import Layout from '../../components/Layout';
import Template from '../../components/Template';

/* NextJS will take the folder's name as the route (URL), and display the inner index.tsx
 * Ex: localhost:3000/template
 */
const TemplatePage: () => null | JSX.Element = () => {
  return (
    <Layout>
      <Template />
    </Layout>
  );
};

export default TemplatePage;
