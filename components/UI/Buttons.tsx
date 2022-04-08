import styled from '@emotion/styled';

/* `TestButton1` is a styled component of a normal HTML button, without any props passed
 * `TestButton2` and `TestButton3` are styled components that inherits the properties of `TestButton1`
 * `TestButton4` and `TestButton5` also take in optional string-typed props `testProp` which can be used as a parameter to be used within styles
 */
const TestButton1 = styled.button({
  fontSize: '15px',
  backgroundColor: 'black',
});

export const TestButton2 = styled(TestButton1)({
  fontSize: '16px',
});

export const TestButton4 = styled(TestButton1)<{ testProp?: string }>(({ testProp }) => ({
  backgroundColor: testProp ? 'blue' : 'red',
}));

type TestButtonProps = {
  testProp?: boolean;
};

export const TestButton5 = styled(TestButton1)<TestButtonProps>(({ testProp }) => ({
  backgroundColor: testProp ? 'green' : 'yellow',
}));

type ButtonProps = {
  disabled?: boolean;
};

export const Button = styled.button<ButtonProps>(({ disabled }) => {
  if (!disabled) {
    return { cursor: 'pointer' };
  }
});
