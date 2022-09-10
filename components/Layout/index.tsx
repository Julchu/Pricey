import React, { FC, ReactNode } from 'react';
import Footer from '../Footer';
import { FooterWrapper, HeaderWrapper, InnerWrapper, Wrapper } from './styles';
import Header from '../Header';

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
