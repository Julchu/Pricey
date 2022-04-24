import styled from '@emotion/styled';

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
