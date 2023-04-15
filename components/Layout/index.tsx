import { FC, ReactNode, useCallback } from 'react';
import {
  AbsoluteCenter,
  Avatar,
  Box,
  Circle,
  Heading,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Spinner,
  Square,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { Unit } from '../../lib/firebase/interfaces';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box /* bg={'darkcyan'} */ height={{ base: '100svh', sm: '100vh' }} width={{ sm: '100vw' }}>
      <Header />

      {children}
    </Box>
  );
};

const Header: FC = () => {
  const { authUser, loading: userLoading, login, logout } = useAuth();

  const loginHandler = useCallback(async () => {
    if (!authUser) await login();
    else await logout();
  }, [authUser, login, logout]);

  return (
    <Box justifyContent={'space-between'} display={{ base: 'flex', sm: 'block' }}>
      <LinkBox as={Heading}>
        <LinkOverlay as={NextLink} href={'/'}>
          <Heading color={'lightcoral'} float={{ base: 'left' }} m={'20px 30px'} h={'40px'}>
            Pricey
          </Heading>
        </LinkOverlay>
      </LinkBox>

      <Menu>
        <MenuButton
          as={Circle}
          float={{ sm: 'right' }}
          m={'20px 30px'}
          size={'40px'}
          transition="all 0.2s"
          aria-label={'Open menu'}
          cursor={'pointer'}
          borderRadius={authUser ? '50%' : '5px'}
          boxShadow={'normal'}
          _hover={{ boxShadow: 'hover' }}
          _expanded={{ boxShadow: 'focus' }}
          _focus={{ boxShadow: 'focus' }}
          pos={'relative'}
        >
          <Square>
            {authUser ? (
              <Skeleton isLoaded={!userLoading} fitContent={true}>
                <Avatar
                  alignSelf={'center'}
                  justifySelf={'center'}
                  m="auto"
                  src={authUser?.photoURL}
                  borderRadius={authUser ? '50%' : '5px'}
                  boxShadow={'normal'}
                />
              </Skeleton>
            ) : userLoading ? (
              <Spinner m="auto" />
            ) : (
              <HamburgerIcon color={'black'} alignSelf={'center'} justifySelf={'center'} m="auto" />
            )}
          </Square>
        </MenuButton>

        <MenuList>
          {/* Mass switch */}
          <MenuOptionGroup defaultValue={Unit.kilogram} title="Unit toggles" type="radio">
            <MenuItemOption closeOnSelect={false} value={Unit.kilogram}>
              Kilograms
            </MenuItemOption>
            <MenuItemOption closeOnSelect={false} value={Unit.pound}>
              Pounds
            </MenuItemOption>
          </MenuOptionGroup>

          <MenuOptionGroup defaultValue={Unit.litre} title="" type="radio">
            <MenuItemOption closeOnSelect={false} value={Unit.litre}>
              Litres
            </MenuItemOption>
            <MenuItemOption closeOnSelect={false} value={Unit.quart}>
              Quarts
            </MenuItemOption>
          </MenuOptionGroup>

          <MenuDivider />

          <MenuGroup title="Links">
            <MenuItem as={NextLink} href={'/about'}>
              About
            </MenuItem>
          </MenuGroup>

          <MenuDivider />

          <MenuGroup title="Profile">
            <MenuItem onClick={loginHandler}>{authUser ? 'Logout' : 'Login'}</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Layout;
