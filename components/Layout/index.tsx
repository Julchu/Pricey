import React, { FC, ReactNode } from 'react';
import Footer from '../Footer';
import { FooterWrapper, InnerWrapper, Wrapper } from './styles';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      {/* No Header */}
      {/* <HeaderWrapper>
        <Header />
      </HeaderWrapper> */}

      <InnerWrapper>{children}</InnerWrapper>

      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Wrapper>
  );
};

export default Layout;
