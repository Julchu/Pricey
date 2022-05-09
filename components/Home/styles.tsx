import styled from '@emotion/styled';
import { Input, Select } from '../UI/Form';
import { Column, Grid, Line, Row } from '../UI/Structure';

export const HomeInputGrid = styled(Grid)(({ theme: { breakpoints } }) => ({
  gridTemplateColumns: 'auto',
  columnGap: '30px',
  rowGap: '30px',

  [breakpoints.laptop]: {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
}));

export const HomeInputColumn = styled(Column)<{ index?: number }>(
  ({ index, theme: { breakpoints } }) => ({
    [breakpoints.laptop]: {
      gridColumn: index === 0 ? '1/3' : '',
      minWidth: !index ? '250px' : '',
    },
  }),
);

export const HomeInput = styled(Input)<{ error?: boolean }>(
  ({ disabled, error, theme: { color } }) => ({
    color: disabled || error ? 'red' : color,

    '::placeholder': {
      fontWeight: error ? 'normal' : '300',
      color: error ? 'red' : 'grey',
    },
  }),
);

export const HomeSelect = styled(Select)<{ error?: boolean; value?: string }>(
  ({ error, value, theme: { color } }) => ({
    /* If error: red bold ('normal')
     * Else no error, and value: black normal ('400')
     * Else (placeholder): grey lightest (300)
     */
    color: error ? 'red' : value ? color : 'grey',
    fontWeight: error ? 'normal' : value ? '400' : '300',

    '::placeholder': {
      fontWeight: error ? 'normal' : '300',
      color: error ? 'red' : 'grey',
    },
  }),
);

export const CardGrid = styled(Grid)(({ theme: { breakpoints } }) => ({
  gridAutoFlow: 'column',
  columnGap: 'calc(100%)',

  overflowX: 'scroll',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',

  [breakpoints.laptop]: {
    gridAutoFlow: 'row',
    gridTemplateColumns: 'repeat(auto-fill, 250px)',

    columnGap: '30px',
    rowGap: '30px',

    overflowX: 'visible',
    overflowY: 'visible',
  },
}));

export const CardWrapper = styled.div<{ highlighted?: boolean }>(
  ({ theme: { backgroundColor, color, breakpoints, boxShadows }, highlighted }) => ({
    fontFamily: 'Montserrat',
    letterSpacing: '2px',
    fontSize: '16px',

    scrollSnapAlign: 'center',

    backgroundColor,
    color,

    width: 'calc(100vw - 60px)',
    height: '300px',

    display: 'flex',
    flexDirection: 'column',

    border: '1px solid grey',
    borderRadius: '5px',

    [breakpoints.laptop]: {
      width: '250px',

      border: 'none',
      outline: 'none',

      boxShadow: !highlighted ? boxShadows?.normal : boxShadows?.under,
      transition: 'box-shadow 0.2s ease-in-out',

      '&:hover': {
        boxShadow: !highlighted ? boxShadows?.hover : boxShadows?.focus,
        // boxShadow: boxShadows?.under,
      },
    },
  }),
);

export const CardInfoWrapper = styled.div({
  height: '100%',
  width: '100%',
  padding: '15px 30px',
  cursor: 'pointer',
});

export const CardImageDiv = styled.div({
  minHeight: '180px',
  display: 'flex',
});

export const CardImageHolder = styled.div({
  margin: 'auto',
});

export const CardLine = styled(Line)({
  margin: '0px',
});

export const CardInfoRow = styled(Row)({
  textAlign: 'center',
  display: 'block',
  overflow: 'hidden',
});
