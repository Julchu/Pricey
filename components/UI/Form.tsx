import styled from '@emotion/styled';

export const Input = styled.input(({ theme: { boxShadows } }) => ({
  fontFamily: 'Montserrat',
  letterSpacing: '2px',
  fontSize: '16px',
  color: 'black',

  padding: '5px 20px',
  height: '40px',
  width: '100%',

  border: 'none',
  outline: 'none',
  borderRadius: '5px',
  boxShadow: boxShadows?.normal,
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: boxShadows?.hover,
  },

  '::placeholder': {
    fontWeight: '300',
    color: 'grey',
  },

  '&:focus': {
    boxShadow: boxShadows?.focus,
  },
}));

export const Select = styled.select(({ theme: { boxShadows } }) => ({
  fontFamily: 'Montserrat',
  letterSpacing: '2px',
  fontSize: '16px',

  padding: '5px 20px',
  height: '40px',
  width: '100%',

  border: 'none',
  outline: 'none',
  borderRadius: '5px',
  boxShadow: boxShadows?.normal,
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: boxShadows?.hover,
  },

  '&:focus': {
    boxShadow: boxShadows?.focus,
  },
}));

/* Box shadow reference: https://getcssscan.com/css-box-shadow-examples */
