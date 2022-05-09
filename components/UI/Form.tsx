import styled from '@emotion/styled';

export const Input = styled.input(
  ({ theme: { breakpoints, backgroundColor, color, boxShadows } }) => ({
    backgroundColor,
    color,

    fontFamily: 'Montserrat',
    letterSpacing: '2px',
    fontSize: '16px',

    padding: '5px 20px',
    height: '40px',
    width: '100%',

    border: '1px solid grey',
    borderRadius: '5px',

    '::placeholder': {
      fontWeight: '300',
      color: 'grey',
    },

    [breakpoints.laptop]: {
      border: 'none',
      outline: 'none',
      transition: 'box-shadow 0.2s ease-in-out',
      boxShadow: boxShadows.normal,

      '&:hover': {
        boxShadow: boxShadows?.hover,
      },

      '&:focus': {
        boxShadow: boxShadows?.focus,
      },
    },
  }),
);

export const Select = styled.select(
  ({ theme: { breakpoints, color, backgroundColor, boxShadows } }) => ({
    backgroundColor,
    color,

    fontFamily: 'Montserrat',
    letterSpacing: '2px',
    fontSize: '16px',

    padding: '5px 20px',
    height: '40px',
    width: '100%',

    border: '1px solid grey',

    borderRadius: '5px',
    transition: 'box-shadow 0.2s ease-in-out',

    [breakpoints.laptop]: {
      border: 'none',
      outline: 'none',
      boxShadow: boxShadows?.normal,

      '&:hover': {
        boxShadow: boxShadows?.hover,
      },

      '&:focus': {
        boxShadow: boxShadows?.focus,
      },
    },
  }),
);

/* Box shadow reference: https://getcssscan.com/css-box-shadow-examples */
