import styled from '@emotion/styled';
import { Input, Select } from '../UI/Form';
import { Grid } from '../UI/Structure';

export const HomeInput = styled(Input)<{ error?: boolean }>(({ disabled, error }) => ({
  color: disabled || error ? 'red' : 'black',

  '::placeholder': {
    fontWeight: error ? 'normal' : '300',
    color: error ? 'red' : 'grey',
  },
}));

export const HomeSelect = styled(Select)<{ error?: boolean; value?: string }>(
  ({ error, value }) => ({
    /* If error: red bold ('normal')
     * Else no error, and value: black normal ('400')
     * Else (placeholder): grey lightest (300)
     */
    color: error ? 'red' : value ? 'black' : 'grey',
    fontWeight: error ? 'normal' : value ? '400' : '300',

    '::placeholder': {
      fontWeight: error ? 'normal' : '300',
      color: error ? 'red' : 'grey',
    },
  }),
);

export const CardWrapper = styled.div({
  fontFamily: 'Montserrat',
  letterSpacing: '2px',
  fontSize: '16px',
  color: 'black',

  width: '250px',
  height: '300px',

  border: 'none',
  outline: 'none',
  borderRadius: '5px',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    // boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    // boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
  },
});

export const CardInfoWrapper = styled.div({
  padding: '0px 30px',
});

export const HomeGrid = styled(Grid)({
  gridTemplateColumns: 'repeat(auto-fill, 250px)',
  columnGap: '30px',
  rowGap: '30px',
});
