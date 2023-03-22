import { FC, ReactNode, useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { Box, Flex, IconButton, Portal } from '@chakra-ui/react';
import { CloseIcon } from '../Icons/Objects';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {});

  const toggleOpen = (): void => {
    setIsOpen(current => !current);
  };

  return (
    <Flex flexDirection={'column'} height={{ base: '100dvh', sm: '100vh' }} width={{ sm: '100vw' }}>
      {children}
      <Box position={'relative'}>
        <IconButton onClick={toggleOpen} icon={<CloseIcon />} aria-label={'Close sidepanel'} />
      </Box>

      {isOpen ? (
        <Portal>
          <Sidebar />
        </Portal>
      ) : null}
    </Flex>
  );
};

export default Layout;
