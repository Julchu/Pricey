import { FC, ReactNode } from 'react';
import { Box, Container } from '@chakra-ui/react';
import Header from '../Header';
import { useAuthContext } from '../../hooks/useAuthContext';
import { AuthLoading } from '../AuthGuards';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { authLoading } = useAuthContext();

  return (
    <Box height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Container maxW={'container.xl'} p={{ base: '0px' }}>
        <Header />
        {authLoading ? <AuthLoading /> : <>{children}</>}
      </Container>
    </Box>
  );
};

export default Layout;
