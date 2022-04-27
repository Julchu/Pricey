import React, { FC, ReactNode } from 'react';
import { darkModeStyles, useDarkMode } from '../../hooks/darkModeContext';
import Footer from '../Footer';
import { FooterWrapper, InnerWrapper, Wrapper } from './styles';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <Wrapper style={darkModeStyles(darkMode)}>
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
