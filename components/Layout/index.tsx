import React, { FC, ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import { FooterWrapper, HeaderWrapper, InnerWrapper, Wrapper } from './styles';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>

      <InnerWrapper>{children}</InnerWrapper>

      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Wrapper>
  );
};

export default Layout;
