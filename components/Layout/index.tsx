import { FC, ReactNode } from 'react';
import { Box, Container } from '@chakra-ui/react';
import Header from '../Header';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Container maxW="container.xl">
        <Header />

        {children}
      </Container>
    </Box>
  );
};

export default Layout;
