import { FC, ReactNode } from 'react';
import { Box, Heading, IconButton, LinkBox, LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import Sidebar from '../Sidebars';
import { useSidebar } from '../../hooks/useSidebar';
import { HamburgerIcon } from '@chakra-ui/icons';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Header />

      {children}

      <Sidebar />
    </Box>
  );
};

const Header: FC = () => {
  const { openSidebar } = useSidebar();
  return (
    <Box justifyContent={'space-between'} display={{ base: 'flex', sm: 'block' }}>
      <LinkBox as={Heading}>
        <LinkOverlay as={NextLink} href={'/'}>
          <Heading color={'lightcoral'} float={{ base: 'left' }} m={'20px 30px'}>
            Pricey
          </Heading>
        </LinkOverlay>
      </LinkBox>

      <IconButton
        float={{ sm: 'right' }}
        m={'20px 30px'}
        boxShadow={'normal'}
        bg={'none'}
        _hover={{ boxShadow: 'hover' }}
        aria-label={'Open sidepanel'}
        icon={<HamburgerIcon />}
        onClick={() => openSidebar('userActions')}
      />
    </Box>
  );
};

export default Layout;
