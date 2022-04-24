import styled from '@emotion/styled';
import Image from 'next/image';

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
  margin: '20px -30px',
  borderTop: '1px solid lightgrey',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
});

export const RoundedImage = styled(Image)<{
  height?: string | '200px';
  width?: string | '200px';
}>(({ height, width }) => ({
  height,
  width,
  borderRadius: '6px',
}));

/* TODO: add media query breakpoints:
 * https://emotion.sh/docs/media-queries
 * yarn add facepaint
 */
