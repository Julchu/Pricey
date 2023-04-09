import { FC, ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import Sidebar from '../Sidebars';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Flex flexDirection={'column'} height={{ base: '100dvh', sm: '100vh' }} width={{ sm: '100vw' }}>
      {children}

      <Sidebar />
    </Flex>
  );
};

export default Layout;
