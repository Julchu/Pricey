import styled from '@emotion/styled';
import Image from 'next/image';

export const ProfilePicture = styled(Image)<{
  height?: string | '200px';
  width?: string | '200px';
}>(({ height, width }) => ({
  height,
  width,
  borderRadius: '6px',
}));

export const ProfileGrid = styled.div({
  display: 'grid',
  justifyItems: 'center',

  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',

  /* This is better for small screens, once min() is better supported:
   * grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
   */
  rowGap: '20px',
  columnGap: '20px',

  padding: '30px',
});

export const ProfileWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});
