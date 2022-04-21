import styled from '@emotion/styled';

export const Column = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const Row = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
});

export const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 350px)',
  columnGap: '44px',
  rowGap: '44px',
});

export const Test = styled.div(() => ({
  margin: '0px 10px',
}));

export const Line = styled.div({
  margin: '20px -30px 50px -30px',
  borderTop: '1px solid lightgrey',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
});

/* TODO: add media query breakpoints:
 * https://emotion.sh/docs/media-queries
 * yarn add facepaint
 */
