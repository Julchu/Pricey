import styled from '@emotion/styled';

export const FooterInnerWrapper = styled.div(({ theme: { breakpoints } }) => ({
  display: 'grid',
  gridTemplateColumns: '1',
  columnGap: '30px',
  rowGap: '30px',

  width: '100%',
  marginBottom: '30px',

  [breakpoints.desktop]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    // gridTemplateColumns: 'repeat(auto-fill, 250px)',
  },
}));
