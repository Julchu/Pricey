import { FC } from 'react';
import { Button } from '../UI/Buttons';

/* Props in the form of a TypeScript { object }
 * Props1 is a required string
 * Props2 is an optional boolean
 */
type TemplateProps = {
  props1: string;
  props2?: boolean;
};

/* FC means Functional Component: React components with function-like syntax
 * Using Generics (angle brackets) assigns a "type"/required fields for the functional component
 * Ex: ChildTemplate is set to type FC with fields <TemplateProps>
 * Like normal functions with parameters, you can destructure the parameters with {}
 */
const ChildTemplate: FC<TemplateProps> = ({ props1, props2 }) => {
  console.log(props1);
  console.log(props2);

  return (
    <>
      <Button>Test button</Button>
      <Button disabled>Disabled test button</Button>
      <p>Child template component</p>
    </>
  );
};

// Parent component
const Template: FC = () => {
  return (
    /* <> Denotes Fragment, similar to an empty/style-less div used for wrapping multiple elements
     * Fragments are useful because you cannot return multiple React components and export them
     * You need to wrap multiple React components in a Fragment or parent React component/HTML element
     */
    <>
      {/* ChildTemplate requires prop1: string and has optional prop2: boolean */}
      <ChildTemplate props1="test string 1" />
      <ChildTemplate props1={'test string 2'} props2={false} />
      <ChildTemplate props1={'test string'} />
    </>
  );
};

/* You can export as default, so that other files can import Template from '/component/Template'
 * Or you can export const Template and other components within file, so that other files can import { Template } from '/component/Template'
 */
export default Template;
