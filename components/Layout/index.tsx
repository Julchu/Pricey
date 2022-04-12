import React, { FC, ReactNode } from 'react';
import Footer from '../Footer';
import { InnerWrapper, Wrapper } from './styles';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      {/* No Header */}
      {/* <HeaderWrapper>
        <Header />
      </HeaderWrapper> */}

      <InnerWrapper>{children}</InnerWrapper>

      <Footer />
    </Wrapper>
  );
};

export default Layout;
