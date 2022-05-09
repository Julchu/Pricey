import styled from '@emotion/styled';

type ButtonProps = {
  disabled?: boolean;
};

export const Button = styled.button<ButtonProps>(({ disabled }) => {
  if (!disabled) {
    return { cursor: 'pointer' };
  }
});

export const StripeButton = styled.button(
  (
    {
      /*theme: { breakpoints }*/
    },
  ) => ({
    backgroundColor: '#405cf5',

    borderRadius: '5px',
    border: 'none',
    boxShadow:
      'rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0',
    boxSizing: 'border-box',

    color: '#fff',
    letterSpacing: '2px',
    fontFamily:
      'Montserrat,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    fontSize: '100%',

    cursor: 'pointer',
    height: '40px',
    padding: '10px 35px',
    transition: 'all .2s,box-shadow .08s ease-in',

    '&:disabled': {
      cursor: 'default',
    },

    '&:hover': {
      backgroundColor: '#4094f5',
    },

    '&:active': {
      backgroundColor: '#0d0b87',
      // boxShadow:
      //   'rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px',
    },
  }),
);

export const Hyperlink = styled.a({
  color: '#0070f3',
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
});

/* Learning Emotion styled components (Object Styles format): https://emotion.sh/docs/object-styles
 * `TestButton1` is a styled component of a normal HTML button, without any props passed
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

/* Box shadow reference: https://getcssscan.com/css-buttons-examples */
