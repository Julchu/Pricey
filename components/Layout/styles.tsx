import styled from '@emotion/styled';

export const Wrapper = styled.div({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',

  /* To ignore padding for specific components:
   * add { marginLeft: '-30px', marginRight: '-30px', width: 'auto' } to
   * specific component's style
   */
  padding: '30px',
});

export const HeaderWrapper = styled.div({
  marginLeft: 'auto',
  marginRight: 'auto',
});

export const InnerWrapper = styled.div({
  marginBottom: '30px',
});

export const FooterWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 'auto',
});
