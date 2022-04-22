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

export const HomeGrid = styled(Grid)({
  backgroundColor: 'black',
  color: 'white',
});
