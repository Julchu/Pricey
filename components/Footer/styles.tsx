import styled from '@emotion/styled';

export const FooterInnerWrapper = styled.div(({ theme: { breakpoints } }) => ({
  width: '100%',
  marginBottom: '30px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 250px)',
  columnGap: '30px',
  rowGap: '30px',
  [breakpoints.desktop]: {
    gridTemplateColumns: 'repeat(auto-fill, 250px)',
  },
}));
