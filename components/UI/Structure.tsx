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
  width: '100%',
  gridTemplateColumns: 'repeat(auto-fill, 150px)',
  columnGap: '15px',
  rowGap: '15px',
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
