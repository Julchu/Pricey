import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../Header';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Header />

      {children}
    </Box>
  );
};

export default Layout;
