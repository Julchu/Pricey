import { FC, ReactNode } from 'react';
import { Box, Container } from '@chakra-ui/react';
import Header from '../Header';
import { useAuth } from '../../hooks/useAuth';
import { AuthLoading } from '../AuthGuards';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { authLoading } = useAuth();

  return (
    <Box height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Container maxW={'container.xl'} p={{ base: '0px' }} h="100%">
        <Header />
        {authLoading ? <AuthLoading /> : <>{children}</>}
      </Container>
    </Box>
  );
};

export default Layout;
