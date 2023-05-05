import { Box, Text } from '@chakra-ui/react';
import { FC, ReactNode, useState } from 'react';
// import { Button } from '../UI/Buttons';

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
      {/* <Button>Test button</Button>
      <Button disabled>Disabled test button</Button> */}
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

      {/* Testing render prop */}
      <TestingRenderProps />
    </>
  );
};

const TestingRenderProps: FC = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      {/* PassPropsToMeWraps in red background, using named function prop 'render' */}
      <RenderProps1 render={() => <Text>Cheese</Text>} />

      {/* Wraps in blue background and passes title ('banana') to main, using named function prop 'render' */}
      <RenderProps2 render={title => <Text>{title}</Text>} />

      {/* Passing render props as 2 parameters as children, rather than a non-default named prop */}
      <RenderProps3>
        {(text, setText) => {
          return <Text onClick={() => setText('cheese')}>{text}</Text>;
        }}
      </RenderProps3>

      {/* Passing render props as 1 object parameter:
       * Wraps inner text in purple background;
       * onClick will change the text
       */}
      <RenderProps4>
        {({ text, setText }) => {
          return <Text onClick={() => setText('cheese')}>{text}</Text>;
        }}
      </RenderProps4>

      {/* Can be used to wrap regular React child: wraps in purple background with 'text' text */}
      <RenderProps5>
        <Text>text</Text>
      </RenderProps5>

      {/* Can also pass in render props text and setText function */}
      <RenderProps5>
        {({ text, setText }) => {
          return <Text onClick={() => setText('cheese')}>{text}</Text>;
        }}
      </RenderProps5>

      {/* This counter requires state in main app */}
      <Counter count={count} setCount={setCount}>
        <Result total={count} />
      </Counter>

      {/* This counter has counter stage in itself */}
      <Counter2 render={total => <Result2 total={total} />} />
    </>
  );
};

const RenderProps1: FC<{ render: () => ReactNode }> = ({ render }) => {
  return <Box bg="red">{render()}</Box>;
};

// Passes inner text 'banana' to outside component
const RenderProps2: FC<{ render: (title: string) => ReactNode }> = ({ render }) => {
  return <Box bg="blue">{render('banana')}</Box>;
};

// Returns function with individual params ( text, setText ) that returns ReactNode
const RenderProps3: FC<{
  children: (text: string, setText: (text: string) => void) => ReactNode;
}> = ({ children }) => {
  const [text, setText] = useState<string>('');
  return <Box bg="green">{children(text, setText)}</Box>;
};

// Same as RenderProps3 except returns function with object props ({ text, setText }) that returns ReactNode
const RenderProps4: FC<{
  children: (props: { text: string; setText: (text: string) => void }) => ReactNode;
}> = ({ children }) => {
  const [text, setText] = useState<string>('Cheese');
  return <Box bg="royalblue">{children({ text, setText })}</Box>;
};

/* Combine RenderProp3 and RenderProp4 return types: 
  Can return ReactNode or function with object props ({ text, setText }) that returns ReactNode
 */
const RenderProps5: FC<{
  children: ReactNode | ((props: { text: string; setText: (text: string) => void }) => ReactNode);
}> = ({ children }) => {
  const [text, setText] = useState<string>('Cheese');
  return (
    <Box bg="royalblue">
      {typeof children === 'function' ? children({ text, setText }) : children}
    </Box>
  );
};

const Counter = ({
  count,
  setCount,
  children,
}: {
  count: number;
  setCount: (count: number) => void;
  children: JSX.Element;
}): JSX.Element => (
  <>
    <button onClick={() => setCount(count - 1)}>-</button> {count}{' '}
    <button onClick={() => setCount(count + 1)}>+</button> {children}{' '}
  </>
);

const Result = ({ total }: { total: number }): JSX.Element => <h1>The total is {total}</h1>;

const Counter2 = ({ render }: { render: (count: number) => void }): JSX.Element => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button> {count}
      <button onClick={() => setCount(count + 1)}>+</button> {render(count)}
    </>
  );
};

const Result2 = ({ total }: { total: number }): JSX.Element => <h1>The total is {total}</h1>;

/* You can export as default, so that other files can import Template from '/component/Template'
 * Or you can export const Template and other components within file, so that other files can import { Template } from '/component/Template'
 */
export default Template;
