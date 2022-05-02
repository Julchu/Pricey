import styled from '@emotion/styled';
import { Input, Select } from '../UI/Form';
import { Grid, Line, Row } from '../UI/Structure';

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

export const CardWrapper = styled.div<{ highlighted?: boolean }>(
  ({ theme: { boxShadows }, highlighted }) => ({
    fontFamily: 'Montserrat',
    letterSpacing: '2px',
    fontSize: '16px',

    // Change colors for dark-mode
    color: 'black',
    backgroundColor: 'white',

    width: '250px',
    height: '300px',

    display: 'flex',
    flexDirection: 'column',

    border: 'none',
    outline: 'none',
    borderRadius: '5px',
    boxShadow: !highlighted ? boxShadows?.normal : boxShadows?.under,
    transition: 'box-shadow 0.2s ease-in-out',

    '&:hover': {
      boxShadow: !highlighted ? boxShadows?.hover : boxShadows?.focus,
      // boxShadow: boxShadows?.under,
    },
  }),
);

export const CardInfoWrapper = styled.div({
  height: '100%',
  width: '100%',
  padding: '15px 30px',
  cursor: 'pointer',
});

export const HomeCardGrid = styled(Grid)({
  gridTemplateColumns: 'repeat(auto-fill, 250px)',
  columnGap: '30px',
  rowGap: '30px',
});

export const HomeInputGrid = styled(Grid)({
  gridTemplateColumns: 'repeat(auto-fill, 250px)',
  columnGap: '30px',
  rowGap: '30px',
});

export const HomeImageDiv = styled.div({
  minHeight: '180px',
  display: 'flex',
});

export const HomeImageHolder = styled.div({
  margin: 'auto',
});

export const HomeCardLine = styled(Line)({
  margin: '0px',
});

export const HomeCardInfoRow = styled(Row)({
  textAlign: 'center',
  display: 'block',
  overflow: 'hidden',
});
