import styled from '@emotion/styled';

export const Input = styled.input({
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
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  },

  '::placeholder': {
    fontWeight: '300',
    color: 'grey',
  },

  '&:focus': {
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    // boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
  },
});

// TODO: refactor to move props into Home component/style
export const Select = styled.select({
  fontFamily: 'Montserrat',
  letterSpacing: '2px',
  fontSize: '16px',

  padding: '5px 20px',
  height: '40px',
  width: '100%',

  border: 'none',
  outline: 'none',
  borderRadius: '5px',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  },

  '&:focus': {
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    // boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
  },
});

/* Box shadow reference: https://getcssscan.com/css-box-shadow-examples */
