// import React from 'react';
import Template from '../../components/Template';

/* NextJS will take the folder's name as the route (URL), and display the inner index.tsx
 * Ex: localhost:3000/template
 */
const TemplatePage: () => null | JSX.Element = () => {
  return (
    // TODO: Layout w/ header to wrap inner Template component with nav bars
    // <Layout>
    <Template />
    // </Layout>
  );
};

export default TemplatePage;
